import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import path from "path";

dotenv.config();

import { db } from "./config/firebase";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import matchRoutes from "./routes/matchRoutes";
import messageRoutes from "./routes/messagesRoutes";
import photoRoutes from "./routes/photoRoutes";
import storyRoutes from "./routes/storyRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import userRoutes from "./routes/userRoutes";
import { protect } from "./middleware/authMiddleware";

const app = express();

const parseOriginList = (...values: Array<string | undefined>) =>
  values.flatMap((value) =>
    String(value || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );

const allowedOrigins = Array.from(
  new Set(
    parseOriginList(
      "http://localhost:5173",
      "http://localhost:5174",
      "https://faithblissafrica.com",
      "https://www.faithblissafrica.com",
      process.env.CLIENT_URL,
      process.env.PUBLIC_APP_URL,
      process.env.CORS_ALLOWED_ORIGINS,
    ),
  ),
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req: any, res: any) => {
  res.status(200).json({
    status: "Server Running",
    database: "Firestore",
    service: "Faithbliss Backend",
  });
});

// Test endpoint to verify Firestore connectivity end-to-end.
app.get("/api/test", async (_req: any, res: any) => {
  try {
    await db.collection("test").doc("connection").set({
      status: "working",
      timestamp: new Date().toISOString(),
    });

    const snapshot = await db.collection("test").doc("connection").get();

    return res.status(200).json({
      message: "Firestore connection successful",
      data: snapshot.data(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: `Firestore connection failed: ${message}` });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/users/photos", protect, photoRoutes);
app.use("/api/matches", protect, matchRoutes);
app.use("/api/conversations", protect, conversationRoutes);
app.use("/api/messages", protect, messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/stories", protect, storyRoutes);

app.use((_req: any, res: any) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer Error:", err.message);
    return res.status(400).json({
      message: `File upload error: ${err.message}`,
      code: err.code,
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? "hidden" : err.stack,
  });
});

export default app;
