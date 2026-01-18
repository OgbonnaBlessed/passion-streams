import { Schema, model, Document } from "mongoose";

export type ContentType =
  | "PDF"
  | "AUDIO"
  | "VIDEO"
  | "ARTICLE"
  | "ANNOUNCEMENT"
  | "PRAYER_POINT";

export type ModuleAccess = "PASSION_SINGLES" | "PASSION_CONNECT" | "PASSION_COUPLES";

export interface IContent extends Document {
  title: string;
  description?: string;
  type: ContentType;
  url: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  category?: string;
  tags: string[];
  isPremium: boolean;
  moduleAccess: ModuleAccess[];
  createdBy: string; // admin userId
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["PDF", "AUDIO", "VIDEO", "ARTICLE", "ANNOUNCEMENT", "PRAYER_POINT"],
      required: true,
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    duration: { type: Number },
    category: { type: String },
    tags: { type: [String], default: [] },
    isPremium: { type: Boolean, default: false },
    moduleAccess: {
      type: [String],
      enum: ["PASSION_SINGLES", "PASSION_CONNECT", "PASSION_COUPLES"],
      required: true,
    },
    createdBy: { type: String, required: true }, // store admin userId
  },
  { timestamps: true }
);

export const ContentModel = model<IContent>("Content", ContentSchema);
