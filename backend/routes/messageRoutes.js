import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import { getMessages, sendMessage, getConversations } from "../controllers/messageController.js";

const router = express.Router();

// GET routes:
router.get("/conversations", checkAuth, getConversations);
router.get("/:otherUserId", checkAuth, getMessages);

// POST routes:
router.post("/", checkAuth, sendMessage);

export default router;