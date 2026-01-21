import { Schema, model, Document } from "mongoose";

// Possible statuses for a subscription
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE" | "EXPIRED";

// Subscription billing plans
export type SubscriptionPlan = "MONTHLY" | "YEARLY";

// Interface for a subscription record
export interface ISubscription extends Document {
  userId: string; // User who owns the subscription
  stripeSubscriptionId?: string; // Stripe subscription reference
  stripeCustomerId?: string; // Stripe customer reference
  status: SubscriptionStatus; // Current status
  plan: SubscriptionPlan; // Billing plan
  currentPeriodEnd: Date; // End of current billing period
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true },
    stripeSubscriptionId: { type: String },
    stripeCustomerId: { type: String },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "PAST_DUE", "EXPIRED"],
      required: true,
    },
    plan: { type: String, enum: ["MONTHLY", "YEARLY"], required: true },
    currentPeriodEnd: { type: Date, required: true },
  },
  { timestamps: true }, // Tracks createdAt and updatedAt
);

// Export model
export const SubscriptionModel = model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);
