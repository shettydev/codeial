const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

// Route to create a new comment, with authentication check using passport middleware
router.post('/create', passport.checkAuthentication, commentsController.create);

// Route to delete a comment, with authentication check using passport middleware
router.get('/destroy/:id', passport.checkAuthentication, commentsController.destroy);

module.exports = router;