const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment')

// Configure the Google OAuth2 strategy
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_clientSecret,
    callbackURL: env.google_callbackURL,
  },
  
  async function(accessToken, refreshToken, profile, done) {
    try {
        // Find user by email in the database
        let user = await User.findOne({ email: profile.emails[0].value }).exec();
        
        if (user) {
            // User already exists, return the user
            return done(null, user);
        } else {
            // Create a new user using Google profile info
            user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString('hex')
            });

            return done(null, user);
        }
    } catch (err) {
      console.log('Error in Google OAuth Strategy:', err);
      return done(err, false);
    }
  }
));

module.exports = passport;
