import { Schema, model, Types, Document } from "mongoose";

// Individual chat message
export interface IChatMessage {
  senderId: Types.ObjectId; // User who sent the message
  content: string; // Message content
  type: "TEXT" | "IMAGE" | "FILE"; // Message type
  createdAt: Date; // Timestamp
}

// Chat document
export interface IChat extends Document {
  participants: Types.ObjectId[]; // Users in the chat
  adminId?: Types.ObjectId; // Admin user (optional)
  lastMessage?: IChatMessage; // Most recent message
  lastActivityAt: Date; // Last chat activity
  isAdminActive?: boolean; // Admin currently in chat
  adminExitsAt?: Date; // When admin leaves
  createdAt: Date;
  updatedAt: Date;
  messages: IChatMessage[]; // All messages
}

// Schema for individual messages
const ChatMessageSchema = new Schema<IChatMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["TEXT", "IMAGE", "FILE"], default: "TEXT" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }, // Keep _id for each message
);

// Schema for chat threads
const ChatSchema = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    adminId: { type: Schema.Types.ObjectId, ref: "User" },
    lastMessage: { type: ChatMessageSchema }, // Embedded last message
    lastActivityAt: { type: Date, default: Date.now },
    isAdminActive: { type: Boolean, default: false },
    adminExitsAt: { type: Date },
    messages: [ChatMessageSchema], // Embedded array of messages
  },
  { timestamps: true }, // Adds createdAt & updatedAt automatically
);

// Export models
export const ChatMessageModel = model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema,
);

export const ChatModel = model<IChat>("Chat", ChatSchema);
