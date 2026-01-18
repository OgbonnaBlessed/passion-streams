import { Schema, model, Document } from "mongoose";

export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELLED"
  | "PAST_DUE"
  | "EXPIRED";
export type SubscriptionPlan = "MONTHLY" | "YEARLY";

export interface ISubscription extends Document {
  userId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

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
  { timestamps: true },
);

export const SubscriptionModel = model<ISubscription>(
  "Subscription",
  SubscriptionSchema,
);
