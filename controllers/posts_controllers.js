const Post = require('../models/posts');
const Comment = require('../models/comment')
const Like = require('../models/like');


// Create a new post
module.exports.create = async function(req, res) {
    try {
        // Create a post using data from the request body and the authenticated user
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        post = await Post.findById(post._id).populate('user', 'name email').exec();

        // used to detect whether a request is made using AJAX
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: 'Post created!'
            });
        }

        req.flash('success', 'Post published')

        // Redirect back to the previous page
        return res.redirect('back');
    } catch (err) {
        req.flash('Error in creating post', err);
        return;
    }
};

// Delete a post and its associated comments
module.exports.destroy = async function(req, res) {
    try {
        // Find the post by ID
        const post = await Post.findById(req.params.id).exec();

        if (!post) {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

        // Check if the current user is the author of the post
        if (post.user == req.user.id) {
            
            //  Delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            // Delete the post
            await post.deleteOne();

            // Delete all comments associated with the post
            await Comment.deleteMany({ post: req.params.id }).exec();

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'Post deleted'
                });
            }

            req.flash('error', 'Post and related comments deleted!');
            
            // Redirect back to the previous page
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back')
    }
    
    // Redirect back to the previous page
    return res.redirect('back');
};