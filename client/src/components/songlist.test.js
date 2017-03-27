import React from 'react';
import ReactDOM from 'react-dom';
import Song from './songlist';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SongList />, div);
});
