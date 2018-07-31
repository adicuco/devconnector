// Load models
const Post = require('../models/Post');

// Load Validation
const validatePostInput = require('../validation/post');

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    return res.status(404).json({ nopostsfound: 'No posts found' });
  }
};

const getPostById = async (req, res) => {
  const errors = {};
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      errors.nopost = `No post found for ${req.params.post_id}`;
      return res.status(404).json(errors);
    }
    return res.json(post);
  } catch (error) {
    errors.nopost = `No post found for ${req.params.psot_id}`;
    return res.status(404).json(errors);
  }
};

const createPost = async (req, res) => {
  try {
    // Validate input
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const postFields = {};
    postFields.user = req.user.id;
    postFields.avatar = req.body.avatar;
    postFields.name = req.body.name;
    postFields.text = req.body.text;

    // Create new profile
    const newPost = await new Post(postFields).save();
    return res.json(newPost);
  } catch (err) {
    throw err;
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Check for post owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ notauthozied: 'User not authorized' });
    }

    // Delete
    await post.remove();
    return res.json({ success: true });
  } catch (err) {
    return res.status(404).json({ postnotfound: 'No post found with that ID' });
  }
};

const likePost = async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'No profile found';
      return res.status(404).json(errors);
    }

    const post = await Post.findById(req.params.post_id);

    const indexOfUser = post.likes.findIndex(like => like.user.toString() === req.user.id);
    indexOfUser === -1
      ? post.likes.unshift({ user: req.user.id })
      : post.likes.splice(indexOfUser, 1);

    await post.save();

    return res.json(post);
  } catch (err) {
    errors.postnotfound = 'No post found';
    return res.status(404).json(errors);
  }
};

const addComment = async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  try {
    let post = await Post.findById(req.params.post_id);
    if (!post) {
      errors.nopost = `No post found for ${req.params.post_id}`;
      return res.status(404).json(errors);
    }

    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    };

    // Add comment to comments array
    post.comments.unshift(newComment);

    // Save the post
    post = await post.save();

    return res.json(post);
  } catch (err) {
    errors.nopost = `No post found for ${req.params.post_id}`;
    return res.status(404).json(errors);
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Check to see if comment exists
    const removeIndex = post.comments.findIndex(
      comment => comment._id.toString() === req.params.comment_id
    );

    if (removeIndex === -1) {
      return res.status(404).json({ commentnotfound: 'Comment does not exist' });
    }

    // Check if user is authorized to delete comment
    if (post.comments[removeIndex].user.toString() !== req.user.id) {
      return res.status(401).json({ notauthozied: 'User not authorized' });
    }

    // Splice comment out of array
    post.comments.splice(removeIndex, 1);

    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(404).json({ postnotfound: 'No post was found with this id' });
  }
};

const likeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Check to see if comment exists
    const commentIndex = post.comments.findIndex(
      comment => comment._id.toString() === req.params.comment_id
    );

    if (commentIndex === -1) {
      return res.status(404).json({ commentnotfound: 'Comment does not exist' });
    }

    const comment = post.comments[commentIndex];
    const indexOfUser = comment.likes.findIndex(like => like.user.toString() === req.user.id);
    indexOfUser === -1
      ? comment.likes.unshift({ user: req.user.id })
      : comment.likes.splice(indexOfUser, 1);

    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(404).json({ postnotfound: 'No post found' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  addComment,
  deleteComment,
  likePost,
  likeComment
};
