import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import { getUserPosts, getFeedPosts, getPostById, createPost, replyToPost, likePost, deletePost } from "../controllers/postController.js";

const router = express.Router();

// GET routes:
router.get('/feed', checkAuth, getFeedPosts);
router.get('/:id', getPostById);
router.get('/user/:username', getUserPosts);

// POST routes:
router.post('/create', checkAuth, createPost);

// PUT routes:
router.put('/like/:id', checkAuth, likePost);
router.put('/reply/:id', checkAuth, replyToPost);

// DELETE routes:
router.delete('/:id', checkAuth, deletePost);

export default router;