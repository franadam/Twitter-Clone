import { AUTH_SUCCESS, AUTH_START, AUTH_LOGOUT } from '../actions/types';

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

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH_START:
      return authStart(state);
    case AUTH_LOGOUT:
      return authLogout(state);
    case AUTH_SUCCESS:
      return authSuccess(state, action);
    default:
      return state;
  }
}
