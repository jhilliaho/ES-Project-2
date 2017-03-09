import React, { Component } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Playlist from '../Playlist/Playlist';
import Song from '../Song/Song';
import User from '../User/User';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
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
