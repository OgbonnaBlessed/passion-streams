import { Schema, model, Document, Types } from "mongoose";

export interface IConnection extends Document {
  user1Id: Types.ObjectId;
  user2Id: Types.ObjectId;
  status: "CONNECTED";
  createdAt: Date;
  connectedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    user1Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user2Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["CONNECTED"], default: "CONNECTED" },
    connectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ConnectionModel = model<IConnection>(
  "Connection",
  ConnectionSchema,
);
