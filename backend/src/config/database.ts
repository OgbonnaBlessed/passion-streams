import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(uri, {
      autoIndex: process.env.NODE_ENV === "development",
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};
