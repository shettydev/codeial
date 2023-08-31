const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controllers');

// Route to create a new post, with authentication check using passport middleware
router.post('/create', passport.checkAuthentication, postsController.create);

// Route to delete a post by its ID, with authentication check using passport middleware
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);
module.exports = router;