import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router'
import Login from '../login/login';
import Register from '../register/register';
import Playlist from '../playlist/playlist';
import Song from '../song/song';
import User from '../user/user';
import Navigation from './navigation/navigation';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Navigation/>
          <Login/>
          <Register/>
          <Playlist/>
          <Song/>
          <User/>
      </div>
    );
  }
}

export default App;
