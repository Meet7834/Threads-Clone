import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'

const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        // if the user is not logged in
        if (!token) return res.status(401).json({ message: 'Unauthorized: Please login to continue!' })

        // if the token exists means user is logged in and we have to decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // we will add the data to req object so that the next() function can access the data (excluding password of course)
        const user = await User.findById(decoded.userId).select('-password');
        req.user = user;
        
        // call the next function
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('Error in checking authorization', err.message);
    }
}

export default checkAuth;