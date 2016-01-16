import { app, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import BrowserWindow from 'browser-window';
import { startRecord, stopRecord } from './record';
import { NOTIFICATION } from './../shared/constants';

let log = console.log.bind(console);
let mainWindow = null;

export const notify = text => {
  log(text);
  mainWindow.webContents.send(NOTIFICATION, { text });
};

app.on('ready', () => {
  const html = process.env.NODE_ENV === 'development' ? 'index-dev.html' : 'index.html';

  mainWindow = new BrowserWindow({ width: 1200, height: 900 });
  mainWindow.loadURL('file://' + path.resolve(__dirname, '..', 'public', html));
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.openDevTools();

  const hotkeys = [
    { key: 'ctrl+x', fn: startRecord },
    { key: 'ctrl+e', fn: stopRecord }
  ];

  hotkeys.forEach(({ key, fn }) => {
    const result = globalShortcut.register(key, fn);
    console.log(`${key} register success: ${result}`);
  });
});

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});
