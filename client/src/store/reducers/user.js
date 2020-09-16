import {
  USER_CURRENT,
  USER_SIGN_UP,
  USER_SIGN_IN,
  USER_AUTH_FAIL,
  USER_LOGOUT,
} from '../actions/types';

import { updateObject } from '../../utils/updateObject';
const initialState = {
  isAuthenticated: false,
  user: {},
  error: {},
  token: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOGOUT:
      return updateObject(state, {
        isAuthenticated: false,
        user: undefined,
      });
    case USER_CURRENT:
      return updateObject(state, {
        isAuthenticated: true,
        token: action.token,
        userID: action.userID,
      });
    case USER_SIGN_UP:
      return updateObject(state, {
        isAuthenticated: false,
        user: action.user,
        token: action.token,
      });
    case USER_SIGN_IN:
      return updateObject(state, {
        isAuthenticated: true,
        user: action.user,
        token: action.token,
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
