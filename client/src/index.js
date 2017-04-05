import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app';
import './index.css';
import configuration from "./conf"

console.log("Starting the app with configuration: ", configuration);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
