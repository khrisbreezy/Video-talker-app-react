import React from 'react';
import ReactDOM from 'react-dom';
// import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
// import {composeWithDevTools} from "redux-devtools-extension";
// import thunkMiddleware from "redux-thunk";

import './index.css';

import App from './App';
// import dashboardReducer from './store/reducers/dashboard';
// import callActionReducer from './store/reducers/callReducer';
import store from './store/store';

// const rootReducer = combineReducers({
//   dashReducer: dashboardReducer,
//   callAction: callActionReducer
// });

// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
