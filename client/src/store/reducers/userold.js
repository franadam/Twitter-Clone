import {
  FETCH_CURRENT_USER,
  USER_AUTH,
  USER_TOKEN,
  USER_AUTH_FAIL,
  USER_LOGOUT,
  FETCH_USER_BY_NAME,
  CLEAR_ERROR,
} from '../actions/types';

import { updateObject } from '../../utils/updateObject';

const initialState = {
  isAuthenticated: false,
  user: {},
  error: null,
  token: '',
  userID: '',
};

const fetchUserByName = (state, action) => {
  const newState = updateObject(state, {
    user: action.user,
  });
  const likes = newState.user.likes.map((like) => like.tweets);
  likes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const user = updateObject(newState.user, { likes });

  return updateObject(newState, { user });
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOGOUT:
      return updateObject(state, {
        ...initialState,
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
        token: action.token || '',
      });
    case FETCH_CURRENT_USER:
      return updateObject(state, {
        isAuthenticated: true,
        user: action.user,
      });

    case FETCH_USER_BY_NAME:
      return fetchUserByName(state, action);
    case USER_AUTH_FAIL:
      return updateObject(state, {
        isAuthenticated: false,
        user: undefined,
        error: action.error,
      });
    case CLEAR_ERROR:
      return updateObject(state, {
        error: null,
      });
    default:
      return state;
  }
}
