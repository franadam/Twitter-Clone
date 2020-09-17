import axios from 'axios';

import { FETCH_TWEETS, FETCH_USER_TWEETS, CREATE_NEW_TWEET } from './types';
import { setAuthToken } from './user';

const getTweets = (tweets) => ({
  type: FETCH_TWEETS,
  tweets,
});

const getUserTweets = (tweets) => ({
  type: FETCH_USER_TWEETS,
  tweets,
});

const postNewTweet = (tweet) => ({
  type: CREATE_NEW_TWEET,
  tweet,
});

export const fetchTweets = () => async (dispatch) => {
  try {
    const tweets = await axios.get('/api/tweets');
    dispatch(getTweets(tweets.data));
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserTweets = (userID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const tweets = await axios.get(`/api/tweets/user/${userID}`);
    dispatch(getUserTweets(tweets.data));
  } catch (error) {
    console.log(error);
  }
};

export const createNewTweet = (data) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const tweet = await axios.post('/api/tweets/', data);
    dispatch(postNewTweet(tweet.data));
  } catch (error) {
    console.log(error);
  }
};
