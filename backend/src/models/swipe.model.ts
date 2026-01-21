import { Schema, model, Document, Types } from "mongoose";

// Swipe record interface
export interface ISwipe extends Document {
  userId: Types.ObjectId; // User performing the swipe
  targetUserId: Types.ObjectId; // User being swiped on
  action: "like" | "pass"; // Swipe action
  createdAt: Date; // Timestamp of swipe
}

// Mongoose schema
const SwipeSchema = new Schema<ISwipe>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["like", "pass"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }, // No automatic timestamps
);

// Export model
export const SwipeModel = model<ISwipe>("Swipe", SwipeSchema);
