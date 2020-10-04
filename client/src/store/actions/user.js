import axios from 'axios';
import { setAuthToken, errorUsers } from './';

import {
  FETCH_CURRENT_USER,
  FETCH_USERS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  FETCH_USER_BY_NAME,
  USER_UPDATE_PROFILE,
} from './types';

const currentUser = (user) => ({
  type: FETCH_CURRENT_USER,
  user,
});

const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS,
  users,
});

const getUserByName = (user) => ({
  type: FETCH_USER_BY_NAME,
  user,
});

const updateProfileSuccess = (user) => ({
  type: USER_UPDATE_PROFILE,
  user,
});

const followUserSuccess = (follow) => ({
  type: FOLLOW_USER,
  follow,
});

const unfollowUserSuccess = (follow) => ({
  type: UNFOLLOW_USER,
  follow,
});

export const fetchUserByName = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/${username}`);
    dispatch(getUserByName(res.data));
  } catch (error) {
    console.log('fetchUserByName error', error);
    dispatch(
      errorUsers({
        ...error,
        message: 'This user does not exist',
      })
    );
  }
};

export const fetchUsers = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/`);
    dispatch(fetchUsersSuccess(res.data));
  } catch (error) {
    dispatch(errorUsers(error));
  }
};

export const updateProfile = (id, updates) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const res = await axios.patch(`/api/users/${id}`, updates, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(updateProfileSuccess(res.data));
  } catch (error) {
    console.log('user error', error);
    dispatch(errorUsers(error));
  }
};

export const fetchCurrentUser = (username) => async (dispatch) => {
  try {
    console.log('action user :>> ', username);
    const res = await axios.get(`/api/users/${username}`);
    dispatch(currentUser(res.data));
  } catch (error) {
    console.log('fetchCurrentUser error', error);
    dispatch(errorUsers(error));
  }
};

export const followUser = (userID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const res = await axios.post(`/api/users/${userID}/follows`);
    console.log('followUser data :>> ', res.data);
    dispatch(followUserSuccess(res.data));
  } catch (error) {
    console.log('follow error :>> ', error);
    dispatch(errorUsers(error));
  }
};

export const unfollowUser = (userID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    setAuthToken(token);
    const res = await axios.delete(`/api/users/${userID}/follows`);
    console.log('unfollowUser data :>> ', res.data);
    dispatch(unfollowUserSuccess(res.data));
  } catch (error) {
    console.log('follow error :>> ', error);
    dispatch(errorUsers(error));
  }
};
