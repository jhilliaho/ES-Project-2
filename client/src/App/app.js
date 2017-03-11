import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute} from 'react-router'
import Login from '../login/login';
import Logout from '../logout/logout';
import Register from '../register/register';
import User from '../user/user';
import Home from '../home/home';
import Layout from '../layout/layout';
import './app.css';

// See React-router tutorial at:
// https://github.com/reactjs/react-router-tutorial/

class App extends Component {
  render() {
    return (
        <Router history={hashHistory}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/user" component={User}/>
                <Route path="/logout" component={Logout}/>
            </Route>
        </Router>
    );
  }
}

export default App;
