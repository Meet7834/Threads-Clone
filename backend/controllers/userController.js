import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import setCookie from '../utils/helpers/setCookie.js';

const signUpUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPass
        });
        await newUser.save();

        if (newUser) {

            setCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' })
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('Error in registering user', err.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPassCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPassCorrect)
            return res.status(400).json({ message: 'Invalid username or password' });

        setCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        })

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('Error in loging in user', err.message);
    }
}

const logOutUser = (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 1 });
        res.status(200).json({ message: 'User logged out succesfully' })
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('Error in logging out user', err.message);
    }
}

const followUnfollowUser = async (req, res) => {
    try {

        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currUser = await User.findById(req.user._id);

        if (id === req.user._id) return res.status(400).json({ message: `You can't follow/unfollow yourself` });

        if (!userToModify || !currUser) return res.status(400).json({ message: `User not found` });

        const isFollowing = currUser.following.includes(id);

        if (isFollowing) {
            // unfollow user
        } else {
            // follow user
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('Error in following user', err.message);
    }
}

export { loginUser, signUpUser, logOutUser, followUnfollowUser };