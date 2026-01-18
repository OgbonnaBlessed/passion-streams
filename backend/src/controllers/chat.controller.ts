import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { ChatModel } from "../models/chat.model";
import { UserModel } from "../models/user.model";

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const chats = await ChatModel.find({
      participants: req.user._id,
    })
      .sort({ lastActivityAt: -1 })
      .limit(50)
      .populate("participants", "fullName email")
      .populate("adminId", "fullName email")
      .lean();

    res.json(chats);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch chats", error: error.message });
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { id: chatId } = req.params;

    const chat = await ChatModel.findById(chatId)
      .populate("messages.senderId", "fullName email")
      .lean();
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!chat.participants.map(String).includes(req.user._id.toString()))
      return res.status(403).json({ message: "Access denied" });

    res.json(chat.messages);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { id: chatId } = req.params;
    const { content, type = "TEXT" } = req.body;

    if (!content)
      return res.status(400).json({ message: "Message content is required" });

    const chat = await ChatModel.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!chat.participants.map(String).includes(req.user._id.toString()))
      return res.status(403).json({ message: "Access denied" });

    const message = {
      senderId: req.user._id as any,
      content,
      type,
      createdAt: new Date(),
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    chat.lastActivityAt = new Date();
    await chat.save();

    res.status(201).json(message);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};

export const inviteAdmin = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { id: chatId } = req.params;

    const chat = await ChatModel.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const admin = await UserModel.findOne({ role: "ADMIN" });
    if (!admin) return res.status(404).json({ message: "No admin available" });

    if (!chat.participants.map(String).includes(admin._id.toString())) {
      chat.adminId = admin._id;
      chat.participants.push(admin._id);
      chat.isAdminActive = true;
      chat.adminExitsAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await chat.save();
    }

    res.json({ message: "Admin invited to chat" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to invite admin", error: error.message });
  }
};
