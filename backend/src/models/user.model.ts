import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  age: number;
  location: { country: string; city: string };
  maritalStatus: "NOT_IN_RELATIONSHIP" | "IN_RELATIONSHIP" | "MARRIED";
  role: "USER" | "ADMIN";
  avatarUrl?: string;
  growthPercentage?: number;
  growthTier?: "TIER_1" | "TIER_2" | "TIER_3";
  subscriptionStatus?: "ACTIVE" | "CANCELLED" | "PAST_DUE" | "EXPIRED";
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    age: { type: Number, required: true },
    // Nested object must have its own Schema
    location: {
      type: new Schema(
        {
          country: { type: String, required: true },
          city: { type: String, required: true },
        },
        { _id: false }, // prevents Mongoose from creating a new _id for the subdocument
      ),
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["NOT_IN_RELATIONSHIP", "IN_RELATIONSHIP", "MARRIED"],
      required: true,
    },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    avatarUrl: { type: String },
    growthPercentage: { type: Number },
    growthTier: { type: String, enum: ["TIER_1", "TIER_2", "TIER_3"] },
    subscriptionStatus: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "PAST_DUE", "EXPIRED"],
    },
    subscriptionEndDate: { type: Date },
  },
  { timestamps: true },
);

export const UserModel = model<IUser>("User", UserSchema);
