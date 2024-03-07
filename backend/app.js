import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})