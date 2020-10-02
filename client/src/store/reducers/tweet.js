import { updateObject } from '../../utils/updateObject';
import {
  FETCH_TWEETS,
  CREATE_NEW_TWEET,
  DELETE_TWEET,
  LIKE_A_TWEET,
  UNLIKE_A_TWEET,
} from '../actions/types';

const initialState = {
  tweets: [],
  new: undefined,
};

const sortByCreatedAt = (tweets) => {
  tweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return tweets;
};

const likeATweet = (state, action) => {
  const tweet = state.tweets.find((tweet) => tweet._id === action.like.tweet);
  const likes = tweet.likes.slice();
  likes.push(action.like);
  const newTweet = updateObject(tweet, { likes });
  const tweets = state.tweets.filter(
    (tweet) => tweet._id !== action.like.tweet
  );
  tweets.push(newTweet);
  sortByCreatedAt(tweets);
  return updateObject(state, { tweets });
};

const unlikeATweet = (state, action) => {
  const tweet = state.tweets.find((tweet) => tweet._id === action.like.tweet);
  const likes = tweet.likes.filter((l) => l._id !== action.like._id);
  const newTweet = updateObject(tweet, { likes });
  const tweets = state.tweets.filter(
    (tweet) => tweet._id !== action.like.tweet
  );
  tweets.push(newTweet);
  sortByCreatedAt(tweets);
  return updateObject(state, { tweets });
};

const deleteTweet = (state, action) => {
  const tweets = state.tweets.filter((tweet) => tweet._id !== action.tweet._id);
  return updateObject(state, { tweets });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TWEETS:
      return updateObject(state, {
        tweets: action.tweets,
      });
    case CREATE_NEW_TWEET:
      return updateObject(state, {
        new: action.tweet,
      });
    case DELETE_TWEET:
      return deleteTweet(state, action);
    case LIKE_A_TWEET:
      return likeATweet(state, action);
    case UNLIKE_A_TWEET:
      return unlikeATweet(state, action);
    default:
      return state;
  }
};

export default reducer;
