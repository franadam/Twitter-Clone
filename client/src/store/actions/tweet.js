import axios from 'axios';

import {
  FETCH_TWEETS,
  FETCH_USER_TWEETS,
  CREATE_NEW_TWEET,
  FETCH_TWEET_COMMENTS,
  DELETE_TWEET,
  FETCH_TWEET_LIKES,
  LIKE_A_TWEET,
  UNLIKE_A_TWEET,
} from './types';
import { setAuthToken } from './userold';

const getTweets = (tweets) => ({
  type: FETCH_TWEETS,
  tweets,
});

const getTweetComments = (comments) => ({
  type: FETCH_TWEET_COMMENTS,
  comments,
});

const getTweetLikes = (likes) => ({
  type: FETCH_TWEET_LIKES,
  likes,
});

const postLike = (like) => ({
  type: LIKE_A_TWEET,
  like,
});

const deleteLike = (like) => ({
  type: UNLIKE_A_TWEET,
  like,
});

const delTweet = (tweet) => ({
  type: DELETE_TWEET,
  tweet,
});

const getUserTweets = (tweets) => ({
  type: FETCH_USER_TWEETS,
  tweets,
});

const postNewTweet = (tweet) => ({
  type: CREATE_NEW_TWEET,
  tweet,
});

export const deleteTweet = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const deletedTweet = await axios.delete(`/api/tweets/${id}`);
    dispatch(delTweet(deletedTweet));
  } catch (error) {
    console.log(error);
  }
};

export const fetchTweets = () => async (dispatch) => {
  try {
    const tweets = await axios.get('/api/tweets');
    dispatch(getTweets(tweets.data));
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserTweets = (username) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const tweets = await axios.get(`/api/tweets/user/${username}`);
    dispatch(getUserTweets(tweets.data));
  } catch (error) {
    console.log(error);
  }
};

export const createNewTweet = (data) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    console.log('action data :>> ', data);
    const tweet = await axios.post('/api/tweets/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('action tweet :>> ', tweet);
    dispatch(postNewTweet(tweet.data));
  } catch (error) {
    console.log(error);
  }
};

export const fetchTweetComments = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const comments = await axios.get(`/api/tweets/${id}/comments`);
    dispatch(getTweetComments(comments.data));
  } catch (error) {
    console.log(error);
  }
};

export const fetchTweetLikes = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const likes = await axios.get(`/api/tweets/${id}/likes`);
    dispatch(getTweetLikes(likes.data));
  } catch (error) {
    console.log(error);
  }
};

export const likeATweet = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const like = await axios.post(`/api/tweets/${id}/likes`);
    dispatch(postLike(like.data));
  } catch (error) {
    console.log(error);
  }
};

export const unlikeATweet = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const like = await axios.delete(`/api/tweets/${id}/likes`);
    dispatch(deleteLike(like.data));
  } catch (error) {
    console.log(error);
  }
};
