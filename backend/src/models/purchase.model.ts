import { Schema, model, Document } from "mongoose";

export type PurchaseItemType = "COURSE" | "BOOK" | "CONTENT";
export type PurchaseStatus = "SUCCESS" | "FAILED" | "REFUNDED";

export interface IPurchase extends Document {
  userId: string;
  itemType: PurchaseItemType;
  itemId: string;
  amount: number;
  stripePaymentIntentId: string;
  status: PurchaseStatus;
  createdAt: Date;
  updatedAt: Date;
}

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
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const PurchaseModel = model<IPurchase>("Purchase", PurchaseSchema);
