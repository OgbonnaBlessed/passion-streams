import { Schema, model, Document } from "mongoose";

// User document interface
export interface IUser extends Document {
  fullName: string;   // User's full name
  email: string;      // Unique email
  password?: string;  // Hashed password (optional for OAuth users)
  age: number;        // User age
  location: { country: string; city: string }; // Nested location info
  maritalStatus: "NOT_IN_RELATIONSHIP" | "IN_RELATIONSHIP" | "MARRIED";
  role: "USER" | "ADMIN";       // User role
  avatarUrl?: string;           // Profile picture
  growthPercentage?: number;    // Progress metric
  growthTier?: "TIER_1" | "TIER_2" | "TIER_3"; // Tier based on growth
  subscriptionStatus?: "ACTIVE" | "CANCELLED" | "PAST_DUE" | "EXPIRED";
  subscriptionEndDate?: Date;   // Subscription expiration
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    age: { type: Number, required: true },
    // Nested location schema
    location: {
      type: new Schema(
        {
          country: { type: String, required: true },
          city: { type: String, required: true },
        },
        { _id: false }, // No _id for subdocument
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
  { timestamps: true }, // Auto-manage createdAt and updatedAt
);

// Export model
export const UserModel = model<IUser>("User", UserSchema);
