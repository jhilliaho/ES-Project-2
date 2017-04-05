import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute} from 'react-router'
import User from '../components/user';
import Home from '../components/home';
import Layout from '../layout/layout';
import SongList from '../components/song/songlist';
import Playlists from '../components/playlist/playlists';
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
                <Route path="/playlists" component={Playlists}/>
            </Route>
        </Router>
    );
  }
}

export default App;
