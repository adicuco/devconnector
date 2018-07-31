const express = require('express');
const passport = require('passport');

// Load Post Controller
const postCtr = require('../../controllers/postCtr');

const router = express.Router();
const passportJWT = passport.authenticate('jwt', { session: false });

// Load Validation

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', postCtr.getAllPosts);

// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  Public
router.get('/:post_id', postCtr.getPostById);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passportJWT, postCtr.createPost);

// @route   DELETE api/posts/:post_id
// @desc    Delete post
// @access  Private
router.delete('/:post_id', passportJWT, postCtr.deletePost);

// @route   POST api/posts/like/:post_id
// @desc    Like/Unlike post
// @access  Private
router.post('/like/:post_id', passportJWT, postCtr.likePost);

// @route   POST api/posts/comment/:post_id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:post_id', passportJWT, postCtr.addComment);

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:post_id/:comment_id', passportJWT, postCtr.deleteComment);

// @route   POST api/posts/comment/like/:post_id/:comment_id
// @desc    Like/Unlike comment
// @access  Private
router.post('/comment/like/:post_id/:comment_id', passportJWT, postCtr.likeComment);

module.exports = router;
