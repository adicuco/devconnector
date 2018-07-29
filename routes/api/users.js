const express = require('express');
const passport = require('passport');

// Load User controller
const userCtr = require('../../controllers/userCtr');

const router = express.Router();
const passportJWT = passport.authenticate('jwt', { session: false });

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', userCtr.registerUser);

// @route   POST api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', userCtr.loginUser);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passportJWT, userCtr.currentUser);

module.exports = router;
