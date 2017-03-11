import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../layout/layout';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Layout />, div);
});
