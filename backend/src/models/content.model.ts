import { Schema, model, Document } from "mongoose";

// Possible content types
export type ContentType =
  | "PDF"
  | "AUDIO"
  | "VIDEO"
  | "ARTICLE"
  | "ANNOUNCEMENT"
  | "PRAYER_POINT";

// Which modules can access this content
export type ModuleAccess = "PASSION_SINGLES" | "PASSION_CONNECT" | "PASSION_COUPLES";

// Content document interface
export interface IContent extends Document {
  title: string; // Content title
  description?: string; // Optional description
  type: ContentType; // Type of content
  url: string; // File/stream URL
  thumbnailUrl?: string; // Optional thumbnail
  duration?: number; // Duration in seconds (for audio/video)
  category?: string; // Optional category
  tags: string[]; // Searchable tags
  isPremium: boolean; // Premium content flag
  moduleAccess: ModuleAccess[]; // Modules that can access
  createdBy: string; // Admin userId who created it
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
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
    createdBy: { type: String, required: true }, // Admin userId
  },
  { timestamps: true } // Auto-manages createdAt & updatedAt
);

// Export model
export const ContentModel = model<IContent>("Content", ContentSchema);
