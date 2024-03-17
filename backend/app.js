import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import connectDB from './db/connectDB.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { v2 as cloudinary } from 'cloudinary';
import messageRoutes from "./routes/messageRoutes.js"
import { app, server } from "./socket/socket.js";

dotenv.config(); // configuring .env file
connectDB(); // connect to db

const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middlewares:
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(morgan('tiny')); // this module logs the api requests to the console

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV.trim() === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// serve the frontend
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// start the server
server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})