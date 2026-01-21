import { Schema, model, Document } from "mongoose";

// Purchase item types
export type PurchaseItemType = "COURSE" | "BOOK" | "CONTENT";

// Status of a purchase
export type PurchaseStatus = "SUCCESS" | "FAILED" | "REFUNDED";

// Interface for a purchase record
export interface IPurchase extends Document {
  userId: string; // User who made the purchase
  itemType: PurchaseItemType; // Type of item purchased
  itemId: string; // ID of the purchased item
  amount: number; // Amount paid
  stripePaymentIntentId: string; // Stripe payment intent reference
  status: PurchaseStatus; // Current status of purchase
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const PurchaseSchema = new Schema<IPurchase>(
  {
    userId: { type: String, required: true },
    itemType: {
      type: String,
      enum: ["COURSE", "BOOK", "CONTENT"],
      required: true,
    },
    itemId: { type: String, required: true },
    amount: { type: Number, required: true },
    stripePaymentIntentId: { type: String, required: true },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "REFUNDED"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }, // Only track creation
);

// Export model
export const PurchaseModel = model<IPurchase>("Purchase", PurchaseSchema);
