import axios from 'axios';

import {
  ADD_POST,
  GET_ERRORS,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  DELETE_POST,
  LIKE_POST
} from './types';

// Add Post
export const addPost = postData => async dispatch => {
  try {
    const res = await axios.post('/api/posts', postData);
    dispatch({ type: ADD_POST, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_ERRORS, payload: err.response.data });
  }
};

// Get Posts
export const getPosts = () => async dispatch => {
  try {
    dispatch(setPostLoading());
    const res = await axios.get('/api/posts');
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_POSTS, payload: null });
  }
};

// Get Post by ID
export const getPost = id => async dispatch => {
  try {
    dispatch(setPostLoading());
    const res = await axios.get(`/api/posts/${id}`);
    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_POST, payload: null });
  }
};

// Delete Post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);
    dispatch({ type: DELETE_POST, payload: id });
  } catch (err) {
    dispatch({ type: GET_ERRORS, payload: err.response.data });
  }
};

// Add Comment
export const addComment = (postId, commentData) => async dispatch => {
  try {
    const res = await axios.post(`/api/posts/comment/${postId}`, commentData);
    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_ERRORS, payload: err.response.data });
  }
};

// Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_ERRORS, payload: err.response.data });
  }
};

// Like/Unlike Post
export const likePost = id => async dispatch => {
  try {
    const res = await axios.post(`/api/posts/like/${id}`);
    dispatch({
      type: LIKE_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Like/Unlike Comment
export const likeComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.post(`/api/posts/comment/like/${postId}/${commentId}`);
    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Set Post loading
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};
