import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute} from 'react-router'
import User from '../components/user';
import Home from '../components/home';
import Layout from '../layout/layout';
import SongList from '../components/songlist';
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
        this.state = {};
    }



  render() {
    return (
        <Router history={hashHistory}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Home}/>
                <Route path="/user" component={User}/>
                <Route path="/songs" component={SongList}/>
            </Route>
        </Router>
    );
  }
}

export default App;
