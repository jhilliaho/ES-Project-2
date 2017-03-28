import React from 'react';
import ReactDOM from 'react-dom';
import AddPlaylist from './addplaylist';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddPlaylist />, div);
});
