import { updateObject } from '../../utils/updateObject';
import {
  FETCH_TWEETS,
  FETCH_USER_TWEETS,
  CREATE_NEW_TWEET,
  FETCH_TWEET_COMMENTS,
  FETCH_TWEET_LIKES,
  LIKE_A_TWEET,
  UNLIKE_A_TWEET,
} from '../actions/types';

const initialState = {
  all: [],
  user: [],
  comments: [],
  new: undefined,
  likes: [],
};

const likeATweet = (state, action) => {
  const likes = state.likes.slice();
  likes.push(action.like);
  return updateObject(state, { likes });
};

const unlikeATweet = (state, action) => {
  const likes = state.likes.filter((l) => l._id !== action.like._id);
  return updateObject(state, { likes });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TWEETS:
      return updateObject(state, {
        all: action.tweets,
      });
    case FETCH_USER_TWEETS:
      return updateObject(state, {
        user: action.tweets,
      });
    case CREATE_NEW_TWEET:
      return updateObject(state, {
        new: action.tweet,
      });
    case FETCH_TWEET_COMMENTS:
      return updateObject(state, {
        comments: action.comments,
      });
    case FETCH_TWEET_LIKES:
      return updateObject(state, {
        likes: action.likes,
      });
    case LIKE_A_TWEET:
      return likeATweet(state, action);
    case UNLIKE_A_TWEET:
      return unlikeATweet(state, action);
    default:
      return state;
  }
};

export default reducer;
