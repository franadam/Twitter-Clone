import axios from 'axios';
import jwt_decode from 'jwt-decode';

import {
  FETCH_CURRENT_USER,
  USER_AUTH,
  USER_AUTH_FAIL,
  USER_LOGOUT,
  USER_TOKEN,
} from './types';

const checkUserToken = (userID, token) => ({
  type: USER_TOKEN,
  userID,
  token,
});

const userAuth = (user, token, isSigned) => ({
  type: USER_AUTH,
  userID: user._id,
  user,
  token,
  isSigned,
});

const currentUser = (user) => ({
  type: FETCH_CURRENT_USER,
  user,
});

const userAuthFail = (errors) => ({
  type: USER_AUTH_FAIL,
  errors,
});

const userLogout = () => ({
  type: USER_LOGOUT,
});

export const setAuthToken = (token) => {
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

export const fetchCurrentUser = () => async (dispatch) => {
  const res = await axios.get('/api/users/current');
  const { token, user } = res.data;
  console.log('fetchCurrentUser user :>> ', res);
  setAuthToken(token);
  dispatch(currentUser(user));
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userID');
  localStorage.removeItem('expirationDate');
  setAuthToken(false);
  dispatch(userLogout());
};

export const signup = (credential) => async (dispatch) => {
  try {
    const res = await axios.post('/api/users/register', credential);
    console.log('signup res :>> ', res);
    const { token, user } = res.data;
    dispatch(userAuth(user, token, false));
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
    dispatch(userAuth(user, token, true));
    const decoded = jwt_decode(token);
    console.log('res :>> ', user);
    const expirationTime = decoded.exp - decoded.iat;
    const expirationDate = new Date().getTime() + expirationTime * 1000;
    localStorage.setItem(
      'expirationDate',
      new Date(expirationDate).toISOString()
    );
    //    dispatch(checkUserToken(user._id, token));
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
      console.log(
        'expirationTime :>> ',
        localStorage.getItem('expirationDate')
      );
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      console.log('expirationDate :>> ', expirationDate);
      console.log('now :>> ', new Date());
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
};
