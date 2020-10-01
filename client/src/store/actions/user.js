import axios from 'axios';
import { setAuthToken, errorUsers } from './';

import {
  FETCH_CURRENT_USER,
  FETCH_USERS,
  FETCH_USER_BY_NAME,
  CLEAR_ERROR,
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

export const clearUserError = () => ({
  type: CLEAR_ERROR,
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

export const fetchCurrentUser = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users/current');
    const { token, user } = res.data;
    setAuthToken(token);
    dispatch(currentUser(user));
  } catch (error) {
    console.log('fetchCurrentUser error', error);
    dispatch(errorUsers(error));
  }
};
