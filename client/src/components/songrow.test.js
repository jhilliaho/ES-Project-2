import React from 'react';
import ReactDOM from 'react-dom';
import SongRow from './songrow';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SongRow />, div);
});
