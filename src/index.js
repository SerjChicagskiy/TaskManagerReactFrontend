import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import loginReducer from './reducers/loginReducer';
import {Router, Route,Redirect} from 'react-router-dom';
import ParticlesBackground from "./components/particles";
import TaskManagerStore from "./components/TaskManager";
import RegisterUser from './components/RegisterUser';
import Login from './components/Login';
import thunk from 'redux-thunk';
import history from './creators/creatorsHisrory';

let store=createStore(loginReducer,
  applyMiddleware(thunk))


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={RegisterUser}/>
        <Route exact path="/task" component={TaskManagerStore}/>
      </Router>
    </Provider>
    <ParticlesBackground/>
  </React.StrictMode>,
  document.getElementById('root')
);