import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { VolunteerModel } from "../models/volunteer.model";

// Return donation and bank details (static for now)
export const getDonationInfo = async (_req: AuthRequest, res: Response) => {
  try {
    res.json({
      bankDetails: {
        accountName: "PassionStreams",
        accountNumber: "1234567890",
        bankName: "Your Bank Name",
        routingNumber: "123456789",
      },
      projects: [
        {
          id: "1",
          name: "Project Name",
          description: "Project description",
          targetAmount: 50000,
          currentAmount: 25000,
          progress: 50,
        },
      ],
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch donation info", error: error.message });
  }
};

// Submit a volunteer application
export const submitVolunteer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { name, email, phone, roles, message } = req.body;

    // Basic request validation
    if (!name || !email || !phone || !roles || roles.length === 0) {
      return res.status(400).json({
        message: "Name, email, phone, and at least one role are required",
      });
    }

    const volunteer = await VolunteerModel.create({
      name,
      email,
      phone,
      roles,
      message,
      status: "PENDING",
    });

    // TODO: notify admin
    res.status(201).json(volunteer);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to submit volunteer form",
      error: error.message,
    });
  }
};
