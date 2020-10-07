import { updateObject } from '../../utils/updateObject';
import {
  CLEAR_ERROR,
  ERROR_AUTH,
  ERROR_COMMENTS,
  ERROR_LIKES,
  ERROR_TWEETS,
  ERROR_USERS,
} from '../actions/types';

const initialState = {
    auth: null,
    users: null,
    tweets: null,
    comments: null,
    likes: null,
  },
  clearError = (state) => updateObject(state, { ...initialState }),
  reducer = (state = initialState, { type, error }) => {
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
