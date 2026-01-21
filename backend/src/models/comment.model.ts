import { Schema, model, Document, Types } from "mongoose";

// Comment document interface
export interface IComment extends Document {
  postId: Types.ObjectId; // Associated post
  userId: Types.ObjectId; // Author of the comment
  content: string; // Comment text
  status: "PENDING" | "APPROVED" | "REJECTED"; // Moderation status
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for comments
const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "CommunityPost", // Link to post
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
    content: { type: String, required: true }, // Text content
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"], // Only these values allowed
      index: true, // Indexed for filtering
      required: true,
    },
  },
  { timestamps: true }, // Adds createdAt & updatedAt automatically
);

// Export Mongoose model
export const CommentModel = model<IComment>("Comment", CommentSchema);
