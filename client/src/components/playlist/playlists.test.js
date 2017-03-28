import React from 'react';
import ReactDOM from 'react-dom';
import Playlists from './playlists';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Playlists />, div);
});
