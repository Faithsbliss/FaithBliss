// src/routes/authRoutes.ts

import express from "express";
import {
  uploadPhotos,
  completeOnboarding,
  createProfileAfterFirebaseRegister,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @route POST /api/auth/register-profile
 * @desc Creates the initial Firestore user profile document after a user
 *       successfully registers with Firebase Auth (client-side).
 * @access Private (Requires Firebase ID Token via 'protect' middleware)
 */
router.post("/register-profile", protect, createProfileAfterFirebaseRegister);

/**
 * @route PUT /api/auth/complete-onboarding
 * @desc Completes the user profile, including photo uploads and final form data.
 * @access Private (Requires Firebase ID Token via 'protect' middleware)
 */
router.put(
  "/complete-onboarding",
  protect,
  uploadPhotos,
  completeOnboarding,
);

export default router;
