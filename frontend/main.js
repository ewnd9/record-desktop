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

const app = <div>
  <div className="settings-bar">
    <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
  </div>
  <div className="main">
    <ImageList />
  </div>
</div>;

ReactDOM.render(app, document.getElementById('root'));
