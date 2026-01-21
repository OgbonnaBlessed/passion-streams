import { Schema, model, Document } from "mongoose";

// Upload record interface
export interface IUpload extends Document {
  userId: string;       // Owner of the uploaded file
  url: string;          // File URL
  publicId: string;     // Cloud storage public ID
  folder: string;       // Folder in cloud storage
  size: number;         // File size in bytes
  mimetype: string;     // File MIME type
  createdAt: Date;      // Timestamp created
  updatedAt: Date;      // Timestamp updated
}

// Mongoose schema
const uploadSchema = new Schema<IUpload>(
  {
    userId: { type: String, required: true, index: true }, // Indexed for faster lookups
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    folder: { type: String },
    size: { type: Number },
    mimetype: { type: String },
  },
  { timestamps: true }, // Auto-manage createdAt and updatedAt
);

// Export model
export const UploadModel = model<IUpload>("Upload", uploadSchema);
