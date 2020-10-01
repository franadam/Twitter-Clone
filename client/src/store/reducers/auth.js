import {
  AUTH_SUCCESS,
  AUTH_START,
  AUTH_FAIL,
  AUTH_LOGOUT,
  CLEAR_ERROR,
} from '../actions/types';

import { updateObject } from '../../utils/updateObject';

const initialState = {
  token: null,
  userID: null,
  loading: false,
  error: null,
};

const authStart = (state) => {
  return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    userID: action.userID,
    token: action.token || '',
    loading: false,
    error: null,
  });
};

const authLogout = (state) => {
  return updateObject(state, {
    ...initialState,
  });
};

const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const clearError = (state) => {
  return updateObject(state, { error: null, loading: false });
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH_START:
      return authStart(state);
    case AUTH_LOGOUT:
      return authLogout(state);
    case AUTH_SUCCESS:
      return authSuccess(state, action);
    case AUTH_FAIL:
      return authFail(state, action);
    case CLEAR_ERROR:
      return clearError(state, action);
    default:
      return state;
  }
}
