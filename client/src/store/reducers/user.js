import {
  FETCH_USERS,
  FETCH_USER_BY_NAME,
  USER_UPDATE_PROFILE,
} from '../actions/types';

import { updateObject } from '../../utils/updateObject';

const initialState = {
  users: [],
  user: {},
};

const getUserLikes = (user) => {
  const likes = user.likes.map((like) => like.tweets);
  likes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const newUser = updateObject(user, { likes });

  return newUser;
};

const getUser = (state, action) => {
  const newState = updateObject(state, {
    user: action.user,
  });
  const user = getUserLikes(newState.user);

  return updateObject(newState, { user });
};

const fetchUsers = (state, action) => {
  const newState = updateObject(state, {
    users: action.users,
  });
  const users = newState.users.map((user) => getUserLikes(user));
  //const user = users.find(user => user._id === userID)
  return updateObject(newState, { users });
};

const updateProfile = (state, action) => {
  const newState = getUser(state, action);
  const users = newState.users.filter((user) => user._id !== action.user._id);
  users.push(newState.user);
  return updateObject(newState, { users });
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
      return fetchUsers(state, action);
    case FETCH_USER_BY_NAME:
      return getUser(state, action);
    case USER_UPDATE_PROFILE:
      return updateProfile(state, action);
    default:
      return state;
  }
}
