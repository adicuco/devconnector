import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store;
if (process.env.NODE_ENV === 'production') {
  store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleware)));
} else {
  store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middleware)));
}

export default store;
