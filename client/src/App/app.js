import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute} from 'react-router'
import User from '../user/user';
import Home from '../home/home';
import Layout from '../layout/layout';
import './app.css';

// See React-router tutorial at:
// https://github.com/reactjs/react-router-tutorial/

// This file includes the module hierarchy.
// Because we want the Layout module (navbar)
// to be always visible, we have it as a parent block
// to all other modules so that all other modules are displayed inside
// the Layout module
class App extends Component {
    constructor() {
        super();
        this.state = {username: "", userid: ""}
    }

  render() {
    return (
        <Router history={hashHistory}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Home}/>
                <Route path="/user" component={User}/>
            </Route>
        </Router>
    );
  }
}

export default App;
