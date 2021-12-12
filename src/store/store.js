import { applyMiddleware, createStore, combineReducers } from 'redux';
import {composeWithDevTools} from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import dashboardReducer from './reducers/dashboard';
import callReducer from './reducers/call';

const rootReducer = combineReducers({
    dashReducer: dashboardReducer,
    call: callReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export default store;


