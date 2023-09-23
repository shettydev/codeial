const Comment = require('../models/comment');
const Post = require('../models/posts')
const Like = require('../models/like');
const commentsMailer = require('../mailer/comments_mail');
// const queue = require('../config/kue');


// Create a new comment
module.exports.create = async function(req,res){
    try{
        // Find the associated post using the post ID from the request body
        const post = await Post.findById(req.body.post).exec();

        if(post) {
            // Create a comment using data from the request body and the authenticated user
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            comment = await Comment.findById(comment._id).populate('user', 'name email').exec();

            commentsMailer.newComment(populatedComment);
            
            // let job = queue.create('emails', comment).save(function(err){    //unable to deploye hence commented
            //     if(err){
            //         console.log('Error in creating a queue', err);
            //         return;
            //     }
            //     console.log('Job enqueued', job.id);
            // });

            // Push the newly created comment into the post's comments array and save the post
            post.comments.push(comment);
            post.save();

            // used to detect whether a request is made using AJAX
            if(req.xhr){

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: 'Comment created!'
                });
            }

            req.flash('success', 'Comment published!');
            
            // Redirect back to the home page
            return res.redirect('/')
        }

    } catch (err) {
        console.log('Error in adding the comment: ',err);
        return res.redirect('/');
    }
}

// Delete a comment
module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id).exec();

        if(!comment){
            return res.redirect('back');
        }

        if(comment.user == req.user.id){
            let postId = comment.post;

            await comment.deleteOne();

            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}).exec();

            // Destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: 'Comment deleted'
                });
            }
            
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in deleting comment', err);
    }
    return res.redirect('back')
}