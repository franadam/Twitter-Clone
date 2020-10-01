import {
  ERROR_AUTH,
  ERROR_USERS,
  ERROR_TWEETS,
  ERROR_LIKES,
  ERROR_COMMENTS,
  CLEAR_ERROR,
} from './types';

export const errorAuth = (error) => ({
  type: ERROR_AUTH,
  error,
});

export const errorUsers = (error) => ({
  type: ERROR_USERS,
  error,
});

export const errorTweets = (error) => ({
  type: ERROR_TWEETS,
  error,
});

export const errorLikes = (error) => ({
  type: ERROR_LIKES,
  error,
});

export const errorComments = (error) => ({
  type: ERROR_COMMENTS,
  error,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});
