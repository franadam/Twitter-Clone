import { combineReducers } from 'redux';
import userReducer from './user';

const RootReducer = combineReducers({
  user: userReducer,
});

export default RootReducer;
