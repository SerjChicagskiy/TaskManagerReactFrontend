import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import loginReducer from './reducers/loginReducer';
import {Router, Route,Redirect} from 'react-router-dom';
import TaskManagerStore from "./components/TaskManager";
import User from "./components/Users";
import RegisterUser from './components/RegisterUser';
import Login from './components/Login';
import thunk from 'redux-thunk';
import history from './creators/creatorsHisrory';
import Particles from './components/particles';

let store=createStore(loginReducer,
  applyMiddleware(thunk))


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <Redirect from="/" to="/login"/>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={RegisterUser}/>
        <Route exact path="/task" component={TaskManagerStore}/>
        <Route exact path="/users" component={User}/>
      </Router>
    </Provider>
    <Particles></Particles>
  </React.StrictMode>,
  document.getElementById('root')
);