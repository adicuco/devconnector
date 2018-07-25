import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { deleteComment, likeComment } from '../../actions/postActions';

class CommentItem extends Component {
  onDeleteClick = (postId, commentId) => {
    this.props.deleteComment(postId, commentId);
  };

  onLikeClick = (postId, commentId) => {
    this.props.likeComment(postId, commentId);
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
    const { comment, postId, auth } = this.props;
    const { onDeleteClick, onLikeClick, findUserLike } = this;

    const thumbIconClass = classnames({
      'fas fa-thumbs-up': true,
      'text-success': findUserLike(comment.likes),
      'text-secondary': !findUserLike(comment.likes)
    });

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img className="rounded-circle d-none d-md-block" src={comment.avatar} alt="" />
            </a>
            <br />
            <p className="text-center">{comment.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{comment.text}</p>
            <button
              type="button"
              className="btn btn-light mr-1"
              onClick={() => {
                onLikeClick(postId, comment._id);
              }}
            >
              <i className={thumbIconClass} />
              <span className="badge badge-light">{comment.likes.length}</span>
            </button>
            {comment.user === auth.user.id ? (
              <button
                className="btn btn-danger mr-1"
                type="button"
                onClick={() => {
                  onDeleteClick(postId, comment._id);
                }}
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment, likeComment }
)(CommentItem);
