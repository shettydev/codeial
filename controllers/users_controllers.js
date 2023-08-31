const User = require('../models/user');
const Friendship = require('../models/friendship');
const fs = require('fs');
const path = require('path');


// Render user profile
module.exports.profile = async function(req, res) {
  try {
      const user = await User.findById({_id: req.params.id});

      let friendship1,friendship2

      friendship1 = await Friendship.findOne({
        from_user: req.user,
        to_user: req.params.id,
      });

      friendship2 = await Friendship.findOne({
        from_user: req.params.id,
        to_user: req.user,
      })


      let populated_user = await User.findById(req.user).populate('friendships').exec();

      const isFriend = friendship1 || friendship2;

      return res.render('user_profile', {
        title: 'User Profile',
        profile_user: user,
        populated_user: populated_user, 
        isFriend: isFriend
      });
  } catch (err) {
      console.log('Error in fetching user profile:', err);
      return res.redirect('back');
  }
};

// Update the user profile
module.exports.update = async function(req, res) {
  try {
    let user = await User.findById(req.params.id).exec();

    await User.uploadedAvatar(req,res,function(err){
      if(err){ console.log('*****Multer Error: ',err)}

      user.name = req.body.name;
      user.email = req.body.email;

      if(req.file){

        if(req.file){
          if(user.avatar){
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }
        }

        // saving the path of the uploaded file into the avatar field in the user
        user.avatar = User.avatarPath + '/' + req.file.filename;
      }
      user.save();
      return res.redirect('back');
    });

    if (!user) {
        return res.status(404).send('User not found');
    }

    if (user.id.toString() === req.user.id.toString()) {
        await User.findByIdAndUpdate(req.params.id, req.body).exec();
    } else {
        return res.status(401).send('Unauthorized');
    }
  } catch (err) {
      console.log('Error in updating user:', err);
      return res.status(500).send('Internal Server Error');
  }
};

// render the sign up page
module.exports.signUp = function(req,res){
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }

  return res.render('user_sign_up',{
      title: "Codeial | Sign Up"
  });
}

// render the sign in page
module.exports.signIn = function(req,res){
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }

  return res.render('user_sign_in',{
      title: "Codeial | Sign In"
  });
}

// Create a new user
module.exports.create = async function(req,res){
  if(req.body.password != req.body.confirm_pass){
      return res.redirect('back');
  }

  const user = await User.create({email: req.body.email, name: req.body.name, password: req.body.password});
  if(user){
      return res.redirect('/users/sign-in');
  }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
  req.flash('success', 'Logged-In Successfully!');
  return res.redirect('/');
}

// Destroy user session (log out)
module.exports.destroySession = function(req, res) {
  req.logout(function(err) {
    if (err) {
      console.log("Error during logout: ", err);
      return;
    }
    req.flash('success', 'Logged-Out Successfully!');
    return res.redirect("/");
  });
};

module.exports.sendRequest = async function(req,res){
  try{
    const fromUser = req.user;
    const toUser = await User.findById(req.params.id).exec();

    await Friendship.create({
      from_user: fromUser,
      to_user: toUser,
    });

    return res.redirect('back');
  } catch (err){
    console.log('Error in sending the friend request', err)
    return res.redirect('/');
  }
}

module.exports.acceptRequest = async function (req, res) {
  try {
    const friendshipId = req.params.id; // The ID of the friendship record to accept

    // Find the friendship record and update its status
    const friendship = await Friendship.findByIdAndUpdate(
      friendshipId,
      { accepted: true },
      { new: true }
    );

    // Redirect to the user profile page
    return res.redirect('back');
  } catch (err) {
    console.log('Error in accepting friend request:', err);
    return res.redirect('back');
  }
};

