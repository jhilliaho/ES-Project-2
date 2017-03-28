import React from 'react';
import ReactDOM from 'react-dom';
import PlayListRow from './playlistrow';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlayListRow />, div);
});
