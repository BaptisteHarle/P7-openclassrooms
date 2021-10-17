import userReducer from './reducers/User.reducer';
import appReducer from './reducers/App.reducer';
import {combineReducers, createStore} from 'redux';

export default createStore(
  combineReducers({
    user: userReducer,
    app: appReducer,
  }),
);
