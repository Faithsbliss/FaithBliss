// src/routes/userRoutes.ts
import express from "express";
import {
  getMe,
  getAllUsers,
  getUserById,
  updateUserProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateUserProfile);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);

export default router;
