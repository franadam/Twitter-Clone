import { AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS } from '../actions/types';

import { updateObject } from '../../utils/updateObject';

const initialState = {
    token: null,
    userID: null,
    loading: false,
  },
  authStart = (state) =>
    updateObject(state, {
      loading: true,
    }),
  authSuccess = (state, action) =>
    updateObject(state, {
      userID: action.userID,
      token: action.token || '',
      loading: false,
    }),
  authLogout = (state) =>
    updateObject(state, {
      ...initialState,
    });

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
