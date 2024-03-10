import { v2 as cloudinary } from "cloudinary";
import Post from '../models/postModel.js';
import User from "../models/userModel.js";

const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 }); // this sorts by newest first

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error in getting user posts!', err);
    }
}

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        const following = user.following; // get all the following of the user

        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 }); // this will find all the posts from the people user has followed

        res.status(200).json(feedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in getting feed', err);
    }
}

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found!' });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in getting post', err);
    }
}

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let { img } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ error: 'PostedBy and text fields are required' });
        }

        const user = await User.findById(postedBy); // user who is creating the post
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // if the user who is creating the post doesn't match the logged in user
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized to create post' });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ postedBy, text, img });
        await newPost.save();

        return res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in creating post', err);
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found!' });
        }

        // if the user is trying to delte someone else's post
        if (post.postedBy.toString() != req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized to delete post!' });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Succesfully deleted post!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in deleting post', err);
    }
}

const likePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found!' });
        }

        const isLiked = post.likes.includes(userId); // check if the user has already liked the post or not

        if (isLiked) {
            // unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: 'Post unliked succesfully!' });
        } else {
            // like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: 'Post liked succesfully!' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in liking post', err);
    }
}

const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: postId } = req.params;

        // this is data of user who is replying to the post
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ error: 'Text field is required!' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found!' });
        }

        const reply = { userId, text, userProfilePic, username };

        post.replies.push(reply);
        await post.save();

        res.status(200).json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in replying to post', err);
    }
}

export { getUserPosts, createPost, deletePost, getFeedPosts, getPostById, likePost, replyToPost };
