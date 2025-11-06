import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import eventInterestRoutes from "./routes/eventInterest.js";
import emailRoutes from "./routes/email.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://event-management-delta-teal.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-interests", eventInterestRoutes);
app.use("/api/email", emailRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "ISKCON Event Management System API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});