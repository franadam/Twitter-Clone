export {
  errorAuth,
  errorUsers,
  errorTweets,
  errorLikes,
  errorComments,
  clearError,
} from './error';

export { logout, signup, login, authCheckState, setAuthToken } from './auth';

export {
  fetchCurrentUser,
  fetchUserByName,
  fetchUsers,
  updateProfile,
  followUser,
  unfollowUser,
} from './user';

export {
  fetchTweets,
  createNewTweet,
  deleteTweet,
  likeATweet,
  unlikeATweet,
} from './tweet';
