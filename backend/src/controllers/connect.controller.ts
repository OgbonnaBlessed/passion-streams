import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PassionConnectProfileModel } from "../models/passionConnectProfile.model";
import { SwipeModel } from "../models/swipe.model";
import { ConnectionModel } from "../models/connection.model";
import { GROWTH_TIER_THRESHOLDS } from "../shared/constants";
import { GrowthTier } from "../shared/types";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const profile = await PassionConnectProfileModel.findOne({
      userId: req.user._id,
    });
    res.json(profile);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
};

export const createOrUpdateProfile = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { bio, photos, interests, whatYouSeek, testimonial } = req.body;

    const profileData = {
      userId: req.user._id,
      bio,
      photos: photos || [],
      interests: interests || [],
      whatYouSeek,
      testimonial,
      isActive: true,
      updatedAt: new Date(),
    };

    const profile = await PassionConnectProfileModel.findOneAndUpdate(
      { userId: req.user._id },
      { $set: profileData },
      { new: true, upsert: true },
    );

    res.json(profile);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to save profile", error: error.message });
  }
};

export const discover = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const userGrowth = req.user.growthPercentage || 0;
    let userTier: GrowthTier = GrowthTier.TIER_1;

    if (userGrowth >= GROWTH_TIER_THRESHOLDS.TIER_3) userTier = GrowthTier.TIER_3;
    else if (userGrowth >= GROWTH_TIER_THRESHOLDS.TIER_2_MIN)
      userTier = GrowthTier.TIER_3;

    const profiles = await PassionConnectProfileModel.find({
      isActive: true,
      userId: { $ne: req.user._id },
    });
    res.json(profiles);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to discover profiles", error: error.message });
  }
};

export const swipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { profileId, action } = req.body;
    if (!profileId || !action)
      return res
        .status(400)
        .json({ message: "Profile ID and action are required" });

    if (action === "like") {
      const existingConnection = await ConnectionModel.findOne({
        $or: [
          { user1Id: req.user._id, user2Id: profileId },
          { user1Id: profileId, user2Id: req.user._id },
        ],
      });

      if (!existingConnection) {
        await SwipeModel.create({
          userId: req.user._id,
          targetUserId: profileId,
          action: "like",
        });

        const mutualSwipe = await SwipeModel.findOne({
          userId: profileId,
          targetUserId: req.user._id,
          action: "like",
        });

        if (mutualSwipe) {
          const connection = await ConnectionModel.create({
            user1Id: req.user._id,
            user2Id: profileId,
            status: "CONNECTED",
          });
          return res.json({
            message: "It's a match!",
            connected: true,
            connection,
          });
        }
      }
    }

    res.json({ message: "Swipe recorded", connected: false });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to swipe", error: error.message });
  }
};

export const getConnections = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const connections = await ConnectionModel.find({
      $or: [{ user1Id: req.user._id }, { user2Id: req.user._id }],
      status: "CONNECTED",
    });

    res.json(connections);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch connections", error: error.message });
  }
};
