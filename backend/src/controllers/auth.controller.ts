import { MaritalStatus, UserRole } from "../shared/types";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import admin from "../config/firebase";
import { UserModel } from "../models/user.model";
import { AGE_LIMITS } from "../shared/constants";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";
import { AuthRequest } from "../middleware/auth.middleware";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  age: number;
  location: { country: string; city: string };
  maritalStatus: MaritalStatus;
}

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      age,
      location,
      maritalStatus,
    }: SignupData = req.body;

    // Validation
    if (
      !fullName ||
      !email ||
      !password ||
      !age ||
      !location ||
      !maritalStatus
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (age < AGE_LIMITS.MIN_AGE) {
      return res
        .status(400)
        .json({ message: `Must be at least ${AGE_LIMITS.MIN_AGE} years old` });
    }

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
      age,
      location,
      maritalStatus,
      role: UserRole.USER,
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    });

    res.status(201).json({ user, token });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await UserModel.findOne({ email });
    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid credentials" });

    const isValid: boolean = await comparePassword(password, user.password);

    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    });
    res.json({ user, token });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "ID token is required" });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email)
      return res.status(400).json({ message: "Email not provided by Google" });

    let user = await UserModel.findOne({ email: payload.email });

    if (!user) {
      return res.status(400).json({
        message: "Please sign up first with email/password",
        requiresSignup: true,
      });
    }

    user.avatarUrl = payload.picture || user.avatarUrl;
    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    });
    res.json({ user, token });
  } catch (error: any) {
    console.error("Google login error:", error);
    res
      .status(500)
      .json({ message: "Google login failed", error: error.message });
  }
};

export const appleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken, user: appleUser } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "ID token is required" });

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Apple token" });
    }

    const email = decodedToken.email || appleUser?.email;
    if (!email)
      return res.status(400).json({ message: "Email not provided by Apple" });

    let user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Please sign up first", requiresSignup: true });

    user.avatarUrl = user.avatarUrl || appleUser?.avatarUrl;
    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    });
    res.json({ user, token });
  } catch (error: any) {
    console.error("Apple login error:", error);
    res
      .status(500)
      .json({ message: "Apple login failed", error: error.message });
  }
};

// Logout controller
export const logout = async (_req: AuthRequest, res: Response) => {
  try {
    // In a JWT setup, logout usually requires token invalidation/blacklisting
    // For now, just return a success message
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

// Get current authenticated user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(req.user);
  } catch (error: any) {
    console.error("Get current user error:", error);
    res
      .status(500)
      .json({ message: "Failed to get current user", error: error.message });
  }
};
