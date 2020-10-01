import { updateObject } from '../../utils/updateObject';
import {
  ERROR_AUTH,
  ERROR_USERS,
  ERROR_TWEETS,
  ERROR_LIKES,
  ERROR_COMMENTS,
  CLEAR_ERROR,
} from '../actions/types';

const initialState = {
  auth: null,
  users: null,
  tweets: null,
  comments: null,
  likes: null,
};

const clearError = (state) => {
  return updateObject(state, { ...initialState });
};

const reducer = (state = initialState, { type, error }) => {
  switch (type) {
    case ERROR_AUTH:
      return updateObject(state, {
        auth: error,
      });
    case ERROR_USERS:
      return updateObject(state, {
        users: error,
      });
    case ERROR_TWEETS:
      return updateObject(state, {
        tweets: error,
      });
    case ERROR_LIKES:
      return updateObject(state, {
        likes: error,
      });
    case ERROR_COMMENTS:
      return updateObject(state, {
        comments: error,
      });
    case CLEAR_ERROR:
      return clearError(state);
    default:
      return state;
  }
};

export default reducer;
