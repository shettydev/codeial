const express = require('express');
const passport = require('passport')
const router = express.Router();
const postAPI = require('../../../controllers/api/v1/posts_api');

router.get('/', postAPI.index);
router.delete('/:id', passport.authenticate('jwt', {session: false}), postAPI.destroy);

module.exports = router;