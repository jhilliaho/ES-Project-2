import React from 'react';
import ReactDOM from 'react-dom';
import Playlist from './playlist';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Playlist />, div);
});
