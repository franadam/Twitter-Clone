import { FETCH_USERS, FETCH_USER_BY_NAME } from '../actions/types';

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

const fetchUserByName = (state, action) => {
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

  return updateObject(newState, { users });
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
      return fetchUsers(state, action);
    case FETCH_USER_BY_NAME:
      return fetchUserByName(state, action);
    default:
      return state;
  }
}
