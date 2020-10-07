import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { errorAuth } from './';

import { AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS, CLEAR_ERROR } from './types';

const checkUserToken = (userID, token) => ({
    type: AUTH_SUCCESS,
    userID,
    token,
  }),
  authStart = () => ({
    type: AUTH_START,
  }),
  authSuccess = (userID, token, isSigned) => ({
    type: AUTH_SUCCESS,
    userID,
    token,
    isSigned,
  }),
  authLogout = () => ({
    type: AUTH_LOGOUT,
  });

export const clearAuthError = () => ({
  type: CLEAR_ERROR,
});

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = token;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const checkAuthTimeout = (expTime) => (dispatch) => {
  setTimeout(() => {
    dispatch(logout());
  }, expTime * 1000);
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userID');
  localStorage.removeItem('expirationDate');
  setAuthToken(false);
  dispatch(authLogout());
};

export const signup = (credential) => async (dispatch) => {
  try {
    const res = await axios.post('/api/users/register', credential),
      { user } = res.data;
    dispatch(authSuccess(user._id, null, false));
  } catch (error) {
    dispatch(errorAuth(error));
  }
};

export const login = (credential) => async (dispatch) => {
  try {
    dispatch(authStart());
    const res = await axios.post('/api/users/login', credential),
      { token, userID } = res.data;
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userID', userID);
    setAuthToken(token);
    dispatch(authSuccess(userID, token, true));
    const decoded = jwt_decode(token),
      expirationTime = decoded.exp - decoded.iat,
      expirationDate = new Date().getTime() + expirationTime * 1000;
    localStorage.setItem(
      'expirationDate',
      new Date(expirationDate).toISOString()
    );
  } catch (error) {
    dispatch(
      errorAuth({
        ...error,
        message: 'The user does not exist or the password is incorrect',
      })
    );
  }
};

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    dispatch(logout());
  } else {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      dispatch(logout());
    } else {
      const userID = localStorage.getItem('userID');
      dispatch(checkUserToken(userID, token));
      dispatch(
        checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
};
