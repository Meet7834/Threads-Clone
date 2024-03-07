import express from "express";
import { loginUser, signUpUser, logOutUser, followUnfollowUser } from '../controllers/userController.js'
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

// POST routes
router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.post('/logout', logOutUser);

// FOLLOW routes
router.post('/follow/:id', checkAuth, followUnfollowUser);

export default router;