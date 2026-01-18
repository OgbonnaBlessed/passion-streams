import { Schema, model, Document, Types } from "mongoose";
import type { GrowthTier } from "../shared/types";

export interface IPassionConnectProfile extends Document {
  userId: Types.ObjectId;
  bio?: string;
  photos: string[];
  interests: string[];
  whatYouSeek?: string;
  testimonial?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  growthTier?: GrowthTier;
}

const PassionConnectProfileSchema = new Schema<IPassionConnectProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String },
    photos: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    whatYouSeek: { type: String },
    testimonial: { type: String },
    isActive: { type: Boolean, default: true },
    growthTier: { type: String, enum: ["TIER_1", "TIER_2", "TIER_3"] },
  },
  { timestamps: true },
);

export const PassionConnectProfileModel = model<IPassionConnectProfile>(
  "PassionConnectProfile",
  PassionConnectProfileSchema,
);
