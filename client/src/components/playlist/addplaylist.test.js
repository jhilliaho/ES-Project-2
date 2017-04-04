import React from 'react';
import ReactDOM from 'react-dom';
import AddPlaylist from './addplaylist';
import configuration from '../../conf.js'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddPlaylist />, div);
});
