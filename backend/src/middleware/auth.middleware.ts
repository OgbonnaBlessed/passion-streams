import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";
import { UserModel } from "../models/user.model";
import type { User } from "../shared/types";

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // FETCH USER FROM MONGODB
    const user = await UserModel.findById(decoded.userId).select('-password').lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user as unknown as User;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};
