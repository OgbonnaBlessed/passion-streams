import { Schema, model, Document } from "mongoose";

export type CourseTier = "FREE" | "PREMIUM";

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnailUrl?: string;
  tier: CourseTier;
  price?: number;
  contents: string[]; // content IDs
  requiredForConnect?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String },
    tier: { type: String, enum: ["FREE", "PREMIUM"], required: true },
    price: { type: Number },
    contents: [{ type: String, required: true }],
    requiredForConnect: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const CourseModel = model<ICourse>("Course", CourseSchema);
