const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Post Model
const Post = require("../../models/Post");

// Load Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  Public
router.get("/:post_id", (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: "No post found with that ID" }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

// @route   DELETE api/posts/:post_id
// @desc    Delete post
// @access  Private
router.delete("/:post_id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Post.findById(req.params.post_id).then(post => {
    // Check for post owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ notauthozied: "User not authorized" });
    }

    // Delete
    post
      .remove()
      .then(() => res.json({ success: true }))
      .catch(err => res.status(404).json({ postnotfound: "No post found with that ID" }));
  });
});

// @route   POST api/posts/like/:post_id
// @desc    Like/Unlike post
// @access  Private
router.post("/like/:post_id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      const indexOfUser = post.likes.findIndex(like => like.user.toString() === req.user.id);
      indexOfUser === -1
        ? post.likes.unshift({ user: req.user.id })
        : post.likes.splice(indexOfUser, 1);
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: "No post found" }));
});

// @route   POST api/posts/comment/:post_id
// @desc    Add comment to post
// @access  Private
router.post("/comment/:post_id", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.post_id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      // Add to commments array
      post.comments.unshift(newComment);

      //Save
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: "No post was found with this id" }));
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        // Check to see if comment exists
        const removeIndex = post.comments.findIndex(
          comment => comment._id.toString() === req.params.comment_id
        );

        if (removeIndex === -1) {
          return res.status(404).json({ commentnotfound: "Comment does not exist" });
        }

        // Check if user is authorized to delete comment
        if (post.comments[removeIndex].user.toString() !== req.user.id) {
          return res.status(401).json({ notauthozied: "User not authorized" });
        }

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post was found with this id" }));
  }
);

// @route   POST api/posts/comment/like/:post_id/:comment_id
// @desc    Like/Unlike comment
// @access  Private
router.post(
  "/comment/like/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        // Check to see if comment exists
        const commentIndex = post.comments.findIndex(
          comment => comment._id.toString() === req.params.comment_id
        );

        if (commentIndex === -1) {
          return res.status(404).json({ commentnotfound: "Comment does not exist" });
        }

        const comment = post.comments[commentIndex];
        const indexOfUser = comment.likes.findIndex(like => like.user.toString() === req.user.id);
        indexOfUser === -1
          ? comment.likes.unshift({ user: req.user.id })
          : comment.likes.splice(indexOfUser, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);
module.exports = router;
