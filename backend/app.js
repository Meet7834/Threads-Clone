import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connectDB from './db/connectDB.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config(); // configuring .env file
connectDB(); // connect to db

const app = express();
const PORT = process.env.PORT || 8080;

// middlewares:
app.use(morgan('tiny')); // this module logs the api requests to the console
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// start the server
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})