import { applyMiddleware, createStore, combineReducers } from 'redux';
import {composeWithDevTools} from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import {persistReducer} from 'redux-persist';

import storage from 'redux-persist/lib/storage';


import dashboardReducer from './reducers/dashboard';
import callReducer from './reducers/call';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['call']
}

const rootReducer = combineReducers({
    dashReducer: persistReducer(persistConfig, dashboardReducer),
    call: callReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export default store;


