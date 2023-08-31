const Post = require('../models/posts')
const User = require('../models/user');

// Define a function to handle the home route
module.exports.home = async function(req, res) {
    try {
        // Fetch all posts from the database and populate the user and comments and likes
        const posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes')
        .exec();
        // Finding the user
        const users = await User.find({}).exec();

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });

    } catch (err) {
        // Handle errors by logging and rendering a fallback view
        console.log('Error in fetching posts:', err);
        return res.render('home', {
            title: "Home"
        });
    }
};