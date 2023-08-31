const User = require('../models/user')
const Friendship = require('../models/friendship');

module.exports.addFriend = async function(req, res){
    try{

        let existingFriendship = await Friendship.findOneAndRemove({
            from_user: req.user,
            to_user: req.query.id
        });

        if(existingFriendship){
            const toUser = await User.findByIdAndUpdate(req.query.id, {
                $pull: {friendships: existingFriendship._id}
            });

            const fromUser = await User.findByIdAndUpdate(req.user.id, {
                $pull: {friendships: existingFriendship._id}
            });

            if(req.xhr){
                return res.status(200).json({
                    deleted: deleted,
                    message: "Request Successful"
                });
            }
        } else {
            let newFriendship = await Friendship.create({
                to_user: req.query.id,
                from_user: req.user._id
            });

            const toUser = await User.findByIdAndUpdate(req.query.id,{
                $push: {friendships: newFriendship._id}
            });

            const fromUser = await User.findByIdAndUpdate(req.user._id,{
                $push: {friendships: newFriendship._id}
            });

        }
        
        return res.redirect('/');
    } catch(err){
        console.log('Error in adding/deleting friend:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}