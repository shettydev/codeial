const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controllers');

// Route to user profile, with authentication check using passport middleware
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

// Route to update user profile
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

// Route to create a new user
router.post('/create', usersController.create);

// Use passport as middleware to authenticate during user sign-in
router.post('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' }), usersController.createSession);

// Route to sign out and destroy session (log out)
router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);


module.exports = router;