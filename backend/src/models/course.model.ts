import { Schema, model, Document } from "mongoose";

// Possible course tiers
export type CourseTier = "FREE" | "PREMIUM";

// Course document interface
export interface ICourse extends Document {
  title: string; // Course title
  description: string; // Detailed description
  thumbnailUrl?: string; // Optional thumbnail image
  tier: CourseTier; // Free or premium tier
  price?: number; // Price if premium
  contents: string[]; // Array of content IDs included in course
  requiredForConnect?: boolean; // Required for PassionConnect access
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String },
    tier: { type: String, enum: ["FREE", "PREMIUM"], required: true },
    price: { type: Number },
    contents: [{ type: String, required: true }], // List of content IDs
    requiredForConnect: { type: Boolean, default: false },
  },
  { timestamps: true } // Auto-manages createdAt & updatedAt
);

// Export model
export const CourseModel = model<ICourse>("Course", CourseSchema);
