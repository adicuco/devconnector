import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '1ffe32a2f9ff8e19652b',
      clientSecret: 'd459decc1aa8c9a67a43cac036d9a17fd17dd0b8',
      count: 5,
      sort: 'created: asc',
      repos: []
    };
  }
  render() {
    return (
      <div>
        <h1>TODO: Profile Github</h1>
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  githubUsername: PropTypes.string
};

export default ProfileGithub;
