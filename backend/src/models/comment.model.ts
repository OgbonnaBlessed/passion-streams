import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      index: true,
      required: true,
    }
  },
  { timestamps: true },
);

export const CommentModel = model<IComment>("Comment", CommentSchema);
