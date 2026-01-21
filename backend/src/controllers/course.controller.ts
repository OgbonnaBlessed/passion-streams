import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { CourseModel } from "../models/course.model";
import { CourseProgressModel } from "../models/courseProgress.model";

// Fetch all courses
export const getCourses = async (_req: AuthRequest, res: Response) => {
  try {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: error.message });
  }
};

// Fetch a single course by ID
export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch course", error: error.message });
  }
};

// Get the authenticated user's progress for a course
export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const progress = await CourseProgressModel.findOne({
      userId: req.user._id,
      courseId: req.params.id,
    });

    // Return default progress if none exists
    if (!progress) {
      return res.json({
        courseId: req.params.id,
        userId: req.user._id,
        completionPercentage: 0,
        completedContents: [],
      });
    }

    res.json(progress);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch progress", error: error.message });
  }
};

// Create or update course progress for the user
export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { completedContents, completionPercentage } = req.body;

    let progress = await CourseProgressModel.findOne({
      userId: req.user._id,
      courseId: req.params.id,
    });

    const now = new Date();
    const progressData: Partial<any> = {
      completedContents: completedContents || [],
      completionPercentage: completionPercentage || 0,
      lastAccessedAt: now,
    };

    // Mark course as completed when 100% is reached
    if (completionPercentage === 100) progressData.completedAt = now;

    if (!progress) {
      progress = await CourseProgressModel.create({
        userId: req.user._id,
        courseId: req.params.id,
        startedAt: now,
        ...progressData,
      });
    } else {
      Object.assign(progress, progressData);
      await progress.save();
    }

    res.json(progress);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to update progress", error: error.message });
  }
};
