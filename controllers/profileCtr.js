const prependHttp = require('prepend-http');
const fetch = require('node-fetch');
const keys = require('../config/keys');

// Load models
const Profile = require('../models/Profile');
const User = require('../models/User');

// Load Validation
const validateProfileInput = require('../validation/profile');
const validateExperienceInput = require('../validation/experience');
const validateEducationInput = require('../validation/education');

const getCurrentProfile = async (req, res) => {
  try {
    const errors = {};

    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar'
    ]);

    if (profile) {
      return res.json(profile);
    }

    errors.noprofile = 'There is no profile for this user';

    return res.status(404).json(errors);
  } catch (error) {
    return res.status(404).json(error);
  }
};

const getProfileByHandle = async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({
      handle: req.params.handle
    }).populate('user', ['name', 'avatar']);

    if (profile) {
      return res.json(profile);
    }

    errors.noprofile = 'There is no profile for this user';

    return res.status(404).json(errors);
  } catch (err) {
    errors.noprofile = 'There is no profile for this user';
    return res.status(404).json(errors);
  }
};

const getProfileById = async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({
      user: req.params.userId
    }).populate('user', ['name', 'avatar']);

    if (profile) {
      return res.json(profile);
    }

    errors.noprofile = 'There is no profile for this user';

    return res.status(404).json(errors);
  } catch (err) {
    errors.noprofile = 'There is no profile for this user';
    return res.status(404).json(errors);
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const errors = {};
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    if (profiles) {
      return res.json(profiles);
    }

    // Check IF profiles doesn't exist
    if (!profiles || profiles.length === 0) {
      errors.noprofile = 'There are no profiles';
      res.status(404).json(errors);
    }
  } catch (err) {
    return res.status(404).json(err);
  }
};

const createUserProfile = async (req, res) => {
  try {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;

    // Skills - Split into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube)
      profileFields.social.youtube = prependHttp(req.body.youtube, {
        https: true
      });
    if (req.body.twitter)
      profileFields.social.twitter = prependHttp(req.body.twitter, {
        https: true
      });
    if (req.body.facebook)
      profileFields.social.facebook = prependHttp(req.body.facebook, {
        https: true
      });
    if (req.body.linkedin)
      profileFields.social.linkedin = prependHttp(req.body.linkedin, {
        https: true
      });
    if (req.body.instagram)
      profileFields.social.instagram = prependHttp(req.body.instagram, {
        https: true
      });
    if (req.body.github)
      profileFields.social.github = prependHttp(req.body.github, {
        https: true
      });

    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    } else {
      // Create profile

      // Check if handle exists
      profile = await Profile.findOne({ handle: profileFields.handle });
      if (profile) {
        errors.handle = 'That handle already exists';
        res.status(400).json(errors);
      }

      // Save Profile
      profile = await new Profile(profileFields).save();
      return res.json(profile);
    }
  } catch (err) {
    throw err;
  }
};

const addExperience = async (req, res) => {
  try {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }

    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    const newExperience = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    // Add to experience array
    profile.experience.unshift(newExperience);

    profile = await profile.save();
    return res.json(profile);
  } catch (err) {
    throw err;
  }
};

const addEducation = async (req, res) => {
  try {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    const newEducation = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    // Add to experience array
    profile.education.unshift(newEducation);

    profile = await profile.save();
    return res.json(profile);
  } catch (err) {
    throw err;
  }
};

const deleteExperience = async (req, res) => {
  const errors = {};

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    const newExp = profile.experience.filter(experience => experience.id !== req.params.exp_id);

    if (newExp.length === profile.experience.length) {
      errors.noexperience = 'There is no experience with this id on this profile';
      return res.status(404).json(errors);
    }

    profile.experience = newExp;
    profile = await profile.save();

    return res.json(profile);
  } catch (err) {
    throw err;
  }
};

const deleteEducation = async (req, res) => {
  const errors = {};

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    const newEdu = profile.education.filter(education => education.id !== req.params.edu_id);

    if (newEdu.length === profile.education.length) {
      errors.noeducation = 'There is no education with this id on this profile';
      return res.status(404).json(errors);
    }

    profile.education = newEdu;
    profile = await profile.save();

    return res.json(profile);
  } catch (err) {
    throw err;
  }
};

const deleteUserAndProfile = async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ success: true });
  } catch (err) {
    throw err;
  }
};

// @route   GET api/profile/github/:username/:count/:sort
// @desc    Get github data from github api
// @access  Public
const getGithubData = async (req, res) => {
  try {
    const clientId = keys.githubClientId;
    const clientSecret = keys.githubClientSecret;

    const { count, sort, username } = req.params;

    const url = `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`;

    const response = await fetch(url);
    const githubData = await response.json();

    return res.json(githubData);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getCurrentProfile,
  getProfileByHandle,
  getProfileById,
  getAllProfiles,
  createUserProfile,
  addExperience,
  addEducation,
  deleteExperience,
  deleteEducation,
  deleteUserAndProfile,
  getGithubData
};
