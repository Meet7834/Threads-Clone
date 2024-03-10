import express from "express";
import protectRoute from "../middlewares/checkAuth.js";
import { getMessages, sendMessage, getConversations } from "../controllers/messageController.js";

const router = express.Router();

// GET routes:
router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);

// POST routes:
router.post("/", protectRoute, sendMessage);

export default router;