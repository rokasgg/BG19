import {combineReducers} from 'redux';
import authReducer from '../reducers/authReducer';
import dummyReducer from '../reducers/dummyReducer';
import regReducer from '../reducers/regReducer';

export default combineReducers({
    auth:authReducer,
    dummyReducer:dummyReducer,
    reg:regReducer
})