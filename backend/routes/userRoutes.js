import express from "express";
import { getUser, getSuggestedUsers, getAllUsers, loginUser, signUpUser, logOutUser, followUnfollowUser, updateUser } from '../controllers/userController.js'
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

// GET routes:
router.get('/allusers', getAllUsers);
router.get('/suggested', checkAuth, getSuggestedUsers);
router.get('/profile/:query', getUser);

// POST routes:
router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.post('/logout', logOutUser);

// FOLLOW routes:
router.post('/follow/:id', checkAuth, followUnfollowUser);

// PUT routes:
router.put('/update/:id', checkAuth, updateUser);

export default router;