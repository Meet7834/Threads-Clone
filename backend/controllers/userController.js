import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import setCookie from '../utils/helpers/setCookie.js';

const getUser = async (req, res) => {
    const { username } = req.params;

    try {
        // do not give password or updatedAt in the res
        const user = await User.findOne({ username }).select('-password').select('-updatedAt');
        if (!user) return res.status(400).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in getting user', err.message);
    }
}

const signUpUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // genereate salt and then hash the password with salt
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // make new user and save it to database
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPass
        });
        await newUser.save();

        if (newUser) {
            setCookie(newUser._id, res); // genereate jwt token and set cookie for the user

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' })
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in registering user', err.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPassCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPassCorrect)
            return res.status(400).json({ error: 'Invalid username or password' });

        setCookie(user._id, res); // set cookie to the browser

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        })

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in loging in user', err.message);
    }
}

const logOutUser = (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 1 }); // remove cookie from the brwoser
        res.status(200).json({ message: 'User logged out succesfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in logging out user', err.message);
    }
}

const followUnfollowUser = async (req, res) => { // toggle follow/unfollow
    try {
        // for ex lets say if ted is following robin:
        const { id } = req.params;  // (id of robin)
        const userToModify = await User.findById(id); // (robin)
        const currUser = await User.findById(req.user._id); // logged in user (in this ex. ted)

        // if user is trying to follow himself
        if (id === req.user._id.toString()) return res.status(400).json({ error: `You can't follow/unfollow yourself` });

        if (!userToModify || !currUser) return res.status(400).json({ error: `User not found` });

        const isFollowing = currUser.following.includes(id);

        if (isFollowing) {
            // unfollow user
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }); // update ted
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }); // update robin
            res.status(200).json({ message: 'User unfollowed succesfully' })
        } else {
            // follow user
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); // update ted
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); // update robin
            res.status(200).json({ message: 'User followed succesfully' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in following/unfollowing user', err.message);
    }
}

const updateUser = async (req, res) => {
    const { name, email, username, password, profilePic, bio } = req.body;
    const userId = req.user._id;

    // if user is trying to update someone else's profile
    if (req.params.id !== userId.toString()) return res.status(401).json({ error: `You can't update other user's profile.` })

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: 'User not found' });

        // generate new hashed password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);
            user.password = hashedPass;
        }

        // check all the changes for the user data
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();
        res.status(200).json({ message: 'Profile updated succefully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in updating user', err.message);
    }
}

export { getUser, loginUser, signUpUser, logOutUser, followUnfollowUser, updateUser };