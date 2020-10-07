import {
  FETCH_CURRENT_USER,
  FETCH_USERS,
  FETCH_USER_BY_NAME,
  FOLLOW_USER,
  UNFOLLOW_USER,
  USER_UPDATE_PROFILE,
} from '../actions/types';

import { updateObject } from '../../utils/updateObject';

const initialState = {
    users: [],
    user: {},
  },
  getUserLikes = (user) => {
    const likes = user.likes.map((like) => like.tweets);
    likes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const newUser = updateObject(user, { likes });

    return newUser;
  },
  getUser = (state, action) => {
    const newState = updateObject(state, {
        user: action.user,
      }),
      user = getUserLikes(newState.user);

    return updateObject(newState, { user });
  },
  fetchUsers = (state, action) => {
    const newState = updateObject(state, {
        users: action.users,
      }),
      users = newState.users.map((user) => getUserLikes(user));
    // Const user = users.find(user => user._id === userID)
    return updateObject(newState, { users });
  },
  updateProfile = (state, action) => {
    const newState = getUser(state, action),
      users = newState.users.filter((user) => user._id !== action.user._id);
    users.push(newState.user);
    return updateObject(newState, { users });
  },
  fetchCurrentUser = (state, { user }) => {
    console.log('reducer user :>> ', user.createdAt);
    return updateObject(state, { user });
  },
  followUser = (state, { follow }) => {
    console.log('user follow :>> ', follow);
    const following = state.user.following.splice();
    following.push(follow);
    following.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log('user following :>> ', following);
    const user = updateObject(state.user, { following });
    return updateObject(state, { user });
  },
  unfollowUser = (state, { follow }) => {
    console.log('user follow :>> ', follow);
    const following = state.user.following.filter(
      (follower) => follower._id !== follow._id
    );
    following.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log('user following :>> ', following);
    const user = updateObject(state.user, { following });
    return updateObject(state, { user });
  };

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
      return fetchUsers(state, action);
    case FETCH_USER_BY_NAME:
      return getUser(state, action);
    case USER_UPDATE_PROFILE:
      return updateProfile(state, action);
    case FETCH_CURRENT_USER:
      return fetchCurrentUser(state, action);
    case FOLLOW_USER:
      return followUser(state, action);
    case UNFOLLOW_USER:
      return unfollowUser(state, action);
    default:
      return state;
  }
}
