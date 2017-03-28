import React from 'react';
import ReactDOM from 'react-dom';
import AddSong from './addsong';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddSong />, div);
});
