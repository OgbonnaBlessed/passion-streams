import { Document, Schema, Types, model } from "mongoose";

// Community post interface
export interface ICommunityPost extends Document {
  userId: Types.ObjectId; // Author of the post
  module: "PASSION_SINGLES" | "PASSION_COUPLES"; // Post category/module
  content: string; // Post text/content
  status: "PENDING" | "APPROVED" | "REJECTED"; // Moderation status
  likes: Types.ObjectId[]; // Users who liked this post
  reviewedBy?: Types.ObjectId; // Admin who reviewed
  reviewedAt?: Date; // When reviewed
  rejectionReason?: string; // Reason if rejected
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Author
    module: {
      type: String,
      enum: ["PASSION_SINGLES", "PASSION_COUPLES"], // Only these modules
      required: true,
    },
    content: { type: String, required: true }, // Post content
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"], // Only these statuses
      default: "PENDING",
      index: true, // Indexed for filtering
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Users who liked
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin reviewer
    reviewedAt: Date, // Timestamp of review
    rejectionReason: String, // Optional rejection reason
  },
  { timestamps: true }, // Auto-manages createdAt & updatedAt
);

// Export model
export const CommunityPostModel = model<ICommunityPost>(
  "CommunityPost",
  CommunityPostSchema,
);
