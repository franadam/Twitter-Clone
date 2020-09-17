import {
  FETCH_CURRENT_USER,
  USER_AUTH,
  USER_TOKEN,
  USER_AUTH_FAIL,
  USER_LOGOUT,
} from '../actions/types';

import { updateObject } from '../../utils/updateObject';

const initialState = {
  isAuthenticated: false,
  user: {},
  error: {},
  token: '',
  userID: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOGOUT:
      return updateObject(state, {
        isAuthenticated: false,
        user: undefined,
      });
    case USER_TOKEN:
      return updateObject(state, {
        isAuthenticated: true,
        token: action.token,
        userID: action.userID,
      });
    case USER_AUTH:
      return updateObject(state, {
        isAuthenticated: action.isSigned,
        user: action.user,
        userID: action.user._id,
        token: action.token,
      });
    case FETCH_CURRENT_USER:
      return updateObject(state, {
        isAuthenticated: true,
        user: action.user,
      });
    case USER_AUTH_FAIL:
      return updateObject(state, {
        isAuthenticated: false,
        user: undefined,
        error: action.error,
      });
    default:
      return state;
  }
}
