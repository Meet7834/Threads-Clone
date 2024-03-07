import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import { getFeedPosts, getPostById, createPost, replyToPost, likePost, deletePost } from "../controllers/postController.js";

const router = express.Router();

// GET routes:
router.get('/feed', checkAuth, getFeedPosts);
router.get('/:id', getPostById);

// POST routes:
router.post('/create', checkAuth, createPost);
router.post('/reply/:id', checkAuth, replyToPost);

// PUT routes:
router.put('/like/:id', checkAuth, likePost);

// DELETE routes:
router.delete('/:id', checkAuth, deletePost);

export default router;