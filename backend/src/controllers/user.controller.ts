import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { UserModel } from "../models/user.model";

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Fetch latest data from MongoDB
    const user = await UserModel.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Get profile error:", error);
    res
      .status(500)
      .json({ message: "Failed to get profile", error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const updates = req.body;

    // Update user in MongoDB
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error: any) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};
