import { v2 as cloudinary } from "cloudinary";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { UploadModel } from "../models/upload.model";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a file
export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    if (!req.file)
      return res.status(400).json({ message: "No file provided" });

    const { folder = "uploads" } = req.body;
    const file = req.file;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: `${folder}/${req.user._id}`,
        resource_type: "auto", // auto-detect file type (image/video/audio)
        use_filename: true,
        unique_filename: true,
      },
      async (error, uploaded) => {
        if (error || !uploaded) {
          console.error("Cloudinary upload error:", error);
          return res
            .status(500)
            .json({ message: "Upload failed", error: error?.message });
        }

        // Save file record in MongoDB
        const uploadDoc = await UploadModel.create({
          userId: req.user?._id,
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          folder: uploaded.folder,
          size: uploaded.bytes,
          mimetype: uploaded.format,
        });

        res.status(201).json(uploadDoc);
      }
    );

    // Convert buffer to stream
    if (file.buffer) {
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(result);
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Delete a file
export const deleteFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { id } = req.params;

    // Find file in MongoDB
    const fileDoc = await UploadModel.findById(id);
    if (!fileDoc) return res.status(404).json({ message: "File not found" });

    // Verify ownership
    if (fileDoc.userId !== req.user._id)
      return res.status(403).json({ message: "Access denied" });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(fileDoc.publicId, { resource_type: "auto" });

    // Delete from MongoDB
    await fileDoc.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (error: any) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
