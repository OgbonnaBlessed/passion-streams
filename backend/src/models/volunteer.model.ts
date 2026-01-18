import { Schema, model, Document } from "mongoose";

export type VolunteerStatus = "PENDING" | "CONTACTED" | "ACCEPTED" | "REJECTED";

export interface IVolunteer extends Document {
  name: string;
  email: string;
  phone: string;
  roles: string[];
  message?: string;
  status: VolunteerStatus;
  createdAt: Date;
}

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
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const VolunteerModel = model<IVolunteer>("Volunteer", VolunteerSchema);
