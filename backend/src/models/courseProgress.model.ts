import { Schema, model, Document } from "mongoose";

export interface ICourseProgress extends Document {
  userId: string;
  courseId: string;
  completionPercentage: number; // 0-100
  completedContents: string[];
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completionPercentage: { type: Number, default: 0 },
    completedContents: { type: [String], default: [] },
    startedAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

export const CourseProgressModel = model<ICourseProgress>(
  "CourseProgress",
  CourseProgressSchema,
);
