import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

//import logger from 'redux-logger';
const configureStore = createStore(rootReducer, {}, applyMiddleware(thunk));

export default configureStore;
