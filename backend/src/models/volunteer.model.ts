import { Schema, model, Document } from "mongoose";

// Volunteer status options
export type VolunteerStatus = "PENDING" | "CONTACTED" | "ACCEPTED" | "REJECTED";

// Volunteer document interface
export interface IVolunteer extends Document {
  name: string;        // Volunteer full name
  email: string;       // Contact email
  phone: string;       // Contact phone
  roles: string[];     // Roles the volunteer is interested in
  message?: string;    // Optional message from volunteer
  status: VolunteerStatus; // Current volunteer status
  createdAt: Date;     // Creation timestamp
}

// Mongoose schema
const VolunteerSchema = new Schema<IVolunteer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    roles: { type: [String], required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "CONTACTED", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }, // Only track creation
);

// Export model
export const VolunteerModel = model<IVolunteer>("Volunteer", VolunteerSchema);
