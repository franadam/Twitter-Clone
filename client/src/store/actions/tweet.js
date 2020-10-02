import axios from 'axios';

import {
  FETCH_TWEETS,
  CREATE_NEW_TWEET,
  DELETE_TWEET,
  LIKE_A_TWEET,
  UNLIKE_A_TWEET,
} from './types';

import { setAuthToken, errorTweets, errorLikes, errorComments } from './';

const getTweets = (tweets) => ({
  type: FETCH_TWEETS,
  tweets,
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
    dispatch(errorTweets(error));
    console.log(error);
  }
};

export const createNewTweet = (data) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const tweet = await axios.post('/api/tweets/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(postNewTweet(tweet.data));
  } catch (error) {
    dispatch(errorTweets(error));
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
    dispatch(errorLikes(error));
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
    dispatch(errorLikes(error));
    console.log(error);
  }
};
