import { Schema, model, Document, Types } from "mongoose";
import type { GrowthTier } from "../shared/types";

// Interface for a user's Passion Connect profile
export interface IPassionConnectProfile extends Document {
  userId: Types.ObjectId; // Reference to the user
  bio?: string; // Short description about user
  photos: string[]; // Array of photo URLs
  interests: string[]; // User interests
  whatYouSeek?: string; // What user is looking for
  testimonial?: string; // Optional testimonial
  isActive: boolean; // Whether profile is active
  createdAt: Date;
  updatedAt: Date;
  growthTier?: GrowthTier; // User growth tier (TIER_1, TIER_2, TIER_3)
}

// Mongoose schema
const PassionConnectProfileSchema = new Schema<IPassionConnectProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per user
    },
    bio: { type: String },
    photos: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    whatYouSeek: { type: String },
    testimonial: { type: String },
    isActive: { type: Boolean, default: true },
    growthTier: { type: String, enum: ["TIER_1", "TIER_2", "TIER_3"] },
  },
  { timestamps: true }, // Auto add createdAt and updatedAt
);

// Export model
export const PassionConnectProfileModel = model<IPassionConnectProfile>(
  "PassionConnectProfile",
  PassionConnectProfileSchema,
);
