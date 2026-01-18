import { Schema, model, Types, Document } from "mongoose";

export interface IChatMessage {
  senderId: Types.ObjectId;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  createdAt: Date;
}

export interface IChat extends Document {
  participants: Types.ObjectId[];
  adminId?: Types.ObjectId;
  lastMessage?: IChatMessage;
  lastActivityAt: Date;
  isAdminActive?: boolean;
  adminExitsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  messages: IChatMessage[];
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["TEXT", "IMAGE", "FILE"], default: "TEXT" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    adminId: { type: Schema.Types.ObjectId, ref: "User" },
    lastMessage: { type: ChatMessageSchema },
    lastActivityAt: { type: Date, default: Date.now },
    isAdminActive: { type: Boolean, default: false },
    adminExitsAt: { type: Date },
    messages: [ChatMessageSchema],
  },
  { timestamps: true },
);

export const ChatModel = model<IChat>("Chat", ChatSchema);
