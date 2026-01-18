import { Schema, model, Document, Types } from "mongoose";

export interface ISwipe extends Document {
  userId: Types.ObjectId;
  targetUserId: Types.ObjectId;
  action: "like" | "pass";
  createdAt: Date;
}

const SwipeSchema = new Schema<ISwipe>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["like", "pass"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

export const SwipeModel = model<ISwipe>("Swipe", SwipeSchema);
