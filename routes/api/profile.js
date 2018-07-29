const express = require('express');
const passport = require('passport');

// Load Profile controller
const profileCtr = require('../../controllers/profileCtr');

const router = express.Router();
const passportJWT = passport.authenticate('jwt', { session: false });

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @route   GET api/profile/
// @desc    Get current user's profile
// @access  Private
router.get('/', passportJWT, profileCtr.getCurrentProfile);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', profileCtr.getAllProfiles);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', profileCtr.getProfileByHandle);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', profileCtr.getProfileById);

// @route   POST api/profile/
// @desc    Create or edit user profile
// @access  Private
router.post('/', passportJWT, profileCtr.createUserProfile);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passportJWT, profileCtr.addExperience);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passportJWT, profileCtr.addEducation);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passportJWT, profileCtr.deleteExperience);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passportJWT, profileCtr.deleteEducation);

// @route   DELETE api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete('/', passportJWT, profileCtr.deleteUserAndProfile);

// @route   GET api/profile/github/:username/:count/:sort
// @desc    Get github data from github api
// @access  Public
router.get('/github/:username/:count/:sort', profileCtr.getGithubData);

module.exports = router;
