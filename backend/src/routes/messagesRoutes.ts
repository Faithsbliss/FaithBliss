import express from "express";
import { createMessage, getUnreadCount } from "../controllers/messagesController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(createMessage);
router.get("/unread-count", protect, getUnreadCount);

export default router;
