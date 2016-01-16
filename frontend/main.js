require('bootstrap/dist/css/bootstrap.min.css');
require('./index.css');

import { ipcRenderer } from 'electron';
import { NOTIFICATION } from './../shared/constants';

ipcRenderer.on(NOTIFICATION, (event, { text }) => {
  const myNotification = new Notification('Journal', {
    body: text
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import ImageList from './components/image-list/image-list';

ReactDOM.render(<ImageList />, document.getElementById('root'));
