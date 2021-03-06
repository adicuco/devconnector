import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { deletePost, likePost } from '../../redux/actions/postActions';

class PostItem extends Component {
  onDeleteClick = id => {
    this.props.deletePost(id);
  };

  onLikeClick = id => {
    this.props.likePost(id);
  };

  findUserLike = likes => {
    const { auth } = this.props;
    if (likes.find(like => like.user === auth.user.id) !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { post, auth, showActions } = this.props;
    const { onDeleteClick, onLikeClick, findUserLike } = this;

    const thumbIconClass = classnames({
      'fas fa-thumbs-up': true,
      'text-success': findUserLike(post.likes),
      'text-secondary': !findUserLike(post.likes)
    });

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            {post.handle ? (
              <div className="profile-info">
                <Link to={`/profile/${post.handle}`} style={{ textDecoration: 'none' }}>
                  <img className="rounded-circle d-none d-md-block" src={post.avatar} alt="" />
                  <br />
                  <p className="text-center">{post.name}</p>
                </Link>
              </div>
            ) : (
              <div className="profile-info">
                <img className="rounded-circle d-none d-md-block" src={post.avatar} alt="" />
                <br />
                <p className="text-center">{post.name}</p>
              </div>
            )}
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions ? (
              <span>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  onClick={() => {
                    onLikeClick(post._id);
                  }}
                >
                  <i className={thumbIconClass} />
                  <span className="badge badge-light">{post.likes.length}</span>
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {post.user === auth.user.id ? (
                  <button
                    className="btn btn-danger mr-1"
                    type="button"
                    onClick={() => {
                      onDeleteClick(post._id);
                    }}
                  >
                    <i className="fas fa-times" />
                  </button>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

PostItem.defaultProps = {
  showActions: true
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost, likePost }
)(PostItem);
