import axios from 'axios';
import jwt_decode from 'jwt-decode';
import * as APIUtil from '../../utils/axios-authorization';

import {
  USER_CURRENT,
  USER_SIGN_UP,
  USER_SIGN_IN,
  USER_AUTH_FAIL,
  USER_LOGOUT,
} from './types';

const currentUser = (userID, token) => ({
  type: USER_CURRENT,
  userID,
  token,
});

const userSignUp = (user, token) => ({
  type: USER_SIGN_UP,
  user,
  token,
});

const userSignIn = (user, token) => ({
  type: USER_SIGN_IN,
  user,
  token,
});

const userAuthFail = (errors) => ({
  type: USER_AUTH_FAIL,
  errors,
});

const userLogout = () => ({
  type: USER_LOGOUT,
});

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const checkAuthTimeout = (expTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expTime * 1000);
  };
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userID');
  setAuthToken(false);
  dispatch(userLogout());
};

export const signup = (credential) => async (dispatch) => {
  try {
    const res = await axios.post('/api/users/register', credential);
    console.log('signup res :>> ', res);
    const { token, user } = res.data;
    dispatch(userSignUp(user, token));
  } catch (error) {
    console.log('signup res :>> ', error);
    dispatch(userAuthFail(error));
  }
};

export const login = (credential) => async (dispatch) => {
  try {
    const res = await axios.post('/api/users/login', credential);
    const { token, user } = res.data;
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userID', user._id);
    setAuthToken(token);
    dispatch(userSignIn(user, token));
    const decoded = jwt_decode(token);
    console.log('res :>> ', user);
    const expirationTime = decoded.exp - decoded.iat;
    localStorage.setItem('expirationDate', expirationTime);
    dispatch(currentUser(user._id, token));
  } catch (error) {
    dispatch(userAuthFail(error));
  }
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userID = localStorage.getItem('userID');
        dispatch(currentUser(userID, token));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
