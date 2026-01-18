import { Schema, model, Document } from "mongoose";

export interface IUpload extends Document {
  userId: string;
  url: string;
  publicId: string;
  folder: string;
  size: number;
  mimetype: string;
  createdAt: Date;
  updatedAt: Date;
}

const uploadSchema = new Schema<IUpload>(
  {
    userId: { type: String, required: true, index: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    folder: { type: String },
    size: { type: Number },
    mimetype: { type: String },
  },
  { timestamps: true },
);

export const UploadModel = model<IUpload>("Upload", uploadSchema);
