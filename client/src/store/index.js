import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

const configureStore = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
);

export default configureStore;
