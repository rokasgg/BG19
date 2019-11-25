import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import logger from "redux-logger";

import promise from 'redux-promise'
import thunk from "redux-thunk";

import combinedReducers from './reducers/index';

const middleWearStack =  __DEV__ ? [thunk, promise, logger] : [thunk, promise];
const middleware = applyMiddleware(...middleWearStack);

const store = createStore(combinedReducers, middleware);

export default store;
