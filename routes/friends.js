const express = require('express');
const router = express.Router();
const passport = require('passport');
const friendshipController = require('../controllers/friendship_controller');

router.get('/add-friend', passport.checkAuthentication, friendshipController.addFriend)

module.exports = router;