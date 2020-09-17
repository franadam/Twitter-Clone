import { combineReducers } from 'redux';
import userReducer from './user';
import tweetReducer from './tweet';

const RootReducer = combineReducers({
  user: userReducer,
  tweet: tweetReducer,
});

export default RootReducer;
