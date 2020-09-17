import { updateObject } from '../../utils/updateObject';
import {
  FETCH_TWEETS,
  FETCH_USER_TWEETS,
  CREATE_NEW_TWEET,
} from '../actions/types';

const initialState = { all: [], user: [], new: undefined };

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
    default:
      return state;
  }
};

export default reducer;
