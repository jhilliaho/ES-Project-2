import React from 'react';
import ReactDOM from 'react-dom';
import SongList from './songlist';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SongList />, div);
});
