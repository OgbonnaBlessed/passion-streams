import { Document, Schema, Types, model } from "mongoose";

export interface ICommunityPost extends Document {
  userId: Types.ObjectId;
  module: "PASSION_SINGLES" | "PASSION_COUPLES";
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  likes: Types.ObjectId[];
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    module: {
      type: String,
      enum: ["PASSION_SINGLES", "PASSION_COUPLES"],
      required: true,
    },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true },
);

export const CommunityPostModel = model<ICommunityPost>(
  "CommunityPost",
  CommunityPostSchema,
);
