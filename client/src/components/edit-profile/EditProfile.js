import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { createProfile, getCurrentProfile } from '../../actions/profileActions';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      github: '',
      errors: {}
    };
  }

  onSubmit = e => {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram,
      github: this.state.github
    };

    this.props.createProfile(profileData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (prevProps.profile.profile !== this.props.profile.profile) {
      const profile = this.props.profile.profile;

      // Bring skills array back to CSV
      const skillsCSV = Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills;

      const {
        company = '',
        website = '',
        location = '',
        bio = '',
        handle = '',
        status = 0,
        social: {
          twitter = '',
          facebook = '',
          instagram = '',
          youtube = '',
          linkedin = '',
          github = ''
        } = {}
      } = profile;

      this.setState({
        handle,
        company,
        website,
        location,
        status,
        skills: skillsCSV,
        bio,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram,
        github
      });
    }
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    const {
      displaySocialInputs,
      handle,
      status,
      errors,
      company,
      website,
      location,
      skills,
      bio,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram,
      github
    } = this.state;
    const { onSubmit, onChange } = this;

    // Select options for status
    const options = [
      { label: 'Select Professional Status *', value: 0 },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Student', value: 'Student' },
      { label: 'Teacher', value: 'Teacher' },
      { label: 'Intern', value: 'Intern' },
      { label: 'Other', value: 'Other' }
    ];

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter Profile URL"
            name="twitter"
            icon="fab fa-fw fa-twitter"
            value={twitter}
            onChange={onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="Facebook Profile URL"
            name="facebook"
            icon="fab fa-fw fa-facebook"
            value={facebook}
            onChange={onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="LinkedIn Profile URL"
            name="linkedin"
            icon="fab fa-fw fa-linkedin"
            value={linkedin}
            onChange={onChange}
            error={errors.linkedin}
          />
          <InputGroup
            placeholder="Youtube Channel URL"
            name="youtube"
            icon="fab fa-fw fa-youtube"
            value={youtube}
            onChange={onChange}
            error={errors.youtube}
          />
          <InputGroup
            placeholder="Instagram Profile URL"
            name="instagram"
            icon="fab fa-fw fa-instagram"
            value={instagram}
            onChange={onChange}
            error={errors.instagram}
          />
          <InputGroup
            placeholder="Github Profile URL"
            name="github"
            icon="fab fa-fw fa-github"
            value={github}
            onChange={onChange}
            error={errors.github}
          />
        </div>
      );
    }
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Edit profile</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={onSubmit}>
                <TextFieldGroup
                  placeholder="Profile Handle *"
                  name="handle"
                  value={handle}
                  onChange={onChange}
                  error={errors.handle}
                  info="A unique handle for your profile URL"
                />
                <SelectListGroup
                  name="status"
                  value={status}
                  onChange={onChange}
                  error={errors.status}
                  options={options}
                  info="Give us an idea of where you are at in your career"
                />
                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={company}
                  onChange={onChange}
                  error={errors.company}
                  info="Could be your own company or one you worked for"
                />
                <TextFieldGroup
                  placeholder="Website"
                  name="website"
                  value={website}
                  onChange={onChange}
                  error={errors.website}
                  info="Could be your own website or a company one"
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={location}
                  onChange={onChange}
                  error={errors.location}
                  info="City and country suggested"
                />
                <TextFieldGroup
                  placeholder="Skills *"
                  name="skills"
                  value={skills}
                  onChange={onChange}
                  error={errors.skills}
                  info="Please use comma separated values (eg. JavaScript,HTML,CSS,Ruby)"
                />
                <TextAreaFieldGroup
                  placeholder="Short Bio"
                  name="bio"
                  value={bio}
                  onChange={onChange}
                  error={errors.bio}
                  info="Tell us a little about yourself"
                />
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                      this.setState({ displaySocialInputs: !this.state.displaySocialInputs });
                    }}
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}
                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(EditProfile));
