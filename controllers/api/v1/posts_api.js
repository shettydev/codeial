const Comment = require('../../../models/comment')
const Post = require('../../../models/posts');

module.exports.index = async function(req,res){
    try {
        // Fetch all posts from the database and populate the user and comments
        const posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec();

    return res.json(200, {
        message: "List of posts",
        posts: posts
    })
} catch(err){
    console.log(err);
};
}

module.exports.destroy = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id).exec();
        
        if (post.user == req.user.id){
            await post.deleteOne();

            await Comment.deleteMany({ post: req.params.id }).exec();
            
            return res.json(200, {
                message: 'Post and associated coments deleted successfully'
            })
        } else {
            return res.json(401, {
                message: 'You cannot delete this post'
            });
        }
    } catch (err) {

        return res.json(500, {
            message: "Internal Server Error"
        });
    }
};