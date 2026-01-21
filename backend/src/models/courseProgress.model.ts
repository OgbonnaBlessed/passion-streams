import { Schema, model, Document } from "mongoose";

// Interface for tracking user progress in a course
export interface ICourseProgress extends Document {
  userId: string; // ID of the user
  courseId: string; // ID of the course
  completionPercentage: number; // Progress % (0-100)
  completedContents: string[]; // IDs of completed content items
  startedAt: Date; // When user started the course
  lastAccessedAt: Date; // Last access timestamp
  completedAt?: Date; // Timestamp when course was fully completed
}

// Mongoose schema
const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completionPercentage: { type: Number, default: 0 },
    completedContents: { type: [String], default: [] }, // Tracks completed content IDs
    startedAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }, // Optional: set when completionPercentage reaches 100
  },
  { timestamps: true }, // Automatically add createdAt & updatedAt
);

// Export model
export const CourseProgressModel = model<ICourseProgress>(
  "CourseProgress",
  CourseProgressSchema,
);
