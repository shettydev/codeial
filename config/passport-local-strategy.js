const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email', // Assuming your login form has an input field named 'email'
    passwordField: 'password', // Assuming your login form has an input field named 'password'
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });
  
      if (!user || user.password !== password) {
        req.flash('error', 'Invalid Username/Password')
        return done(null, false); // Authentication failed
      }
  
      return done(null, user); // Authentication succeeded, pass the user object to the callback
    } catch (err) {
        req.flash('error',err);
        return done(err);
    }
}));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(user => {
            if (!user) {
                return done(null, false);
            }
            done(null, user);
        })
        .catch(err => {
            console.log('Error in finding user --> Passport');
            done(err);
        });
});


// check if the user is authenticated
passport.checkAuthentication = function(req,res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action) 
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/profile');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;