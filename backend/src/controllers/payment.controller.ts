import { Request, Response } from "express";
import Stripe from "stripe";
import { AuthRequest } from "../middleware/auth.middleware";
import { PurchaseModel } from "../models/purchase.model";
import { ISubscription, SubscriptionModel } from "../models/subscription.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// Create a new Stripe subscription and save in MongoDB
export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { planId } = req.body; // 'monthly_premium' or 'yearly_premium'

    // Stripe customer (for simplicity, using userId)
    const customerId = req.user._id;

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    // Save subscription in MongoDB
    const newSub = await SubscriptionModel.create({
      userId: req.user._id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      status: subscription.status.toUpperCase() as ISubscription["status"],
      plan: planId.includes("monthly") ? "MONTHLY" : "YEARLY",
      currentPeriodEnd: new Date(subscription.current_period_end! * 1000),
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent
        ?.client_secret,
      subscription: newSub,
    });
  } catch (error: any) {
    console.error("Create subscription error:", error);
    res
      .status(500)
      .json({ message: "Failed to create subscription", error: error.message });
  }
};

// Create a purchase (one-time payment) and save in MongoDB
export const createPurchase = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { itemType, itemId, amount } = req.body;

    if (!itemType || !itemId || !amount)
      return res.status(400).json({ message: "All fields are required" });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: "usd",
      metadata: { userId: req.user._id, itemType, itemId },
    });

    // Save purchase in MongoDB
    const purchase = await PurchaseModel.create({
      userId: req.user._id,
      itemType,
      itemId,
      amount,
      stripePaymentIntentId: paymentIntent.id,
      status: "PENDING",
    });

    res.json({ clientSecret: paymentIntent.client_secret, purchase });
  } catch (error: any) {
    console.error("Create purchase error:", error);
    res
      .status(500)
      .json({ message: "Failed to create purchase", error: error.message });
  }
};

// Handle Stripe webhook events
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("No signature");

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Update purchase status in MongoDB
        const purchase = await PurchaseModel.findOne({
          stripePaymentIntentId: paymentIntent.id,
        });
        if (purchase) {
          purchase.status = "SUCCESS";
          purchase.updatedAt = new Date();
          await purchase.save();
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const sub = await SubscriptionModel.findOne({
          stripeSubscriptionId: subscription.id,
        });

        if (sub) {
          sub.status =
            subscription.status.toUpperCase() as ISubscription["status"];
          sub.currentPeriodEnd = new Date(
            subscription.current_period_end! * 1000,
          );
          sub.updatedAt = new Date();
          await sub.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
