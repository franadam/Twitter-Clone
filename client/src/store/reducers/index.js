import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import tweetReducer from './tweet';
import errorReducer from './error';

const RootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  tweet: tweetReducer,
  error: errorReducer,
});

export default RootReducer;
