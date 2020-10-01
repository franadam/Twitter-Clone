import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import tweetReducer from './tweet';

const RootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  tweet: tweetReducer,
});

export default RootReducer;
