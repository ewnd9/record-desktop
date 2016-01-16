import { ipcRenderer } from 'electron';
import { NOTIFICATION } from './../shared/constants';

ipcRenderer.on(NOTIFICATION, (event, { text }) => {
  const myNotification = new Notification('Journal', {
    body: text
  });
});


// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
// ipcRenderer.send('asynchronous-message', 'ping');
