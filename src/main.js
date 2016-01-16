import path from 'path';
import fs from 'fs';
import { app, globalShortcut, ipcMain } from 'electron';
import BrowserWindow from 'browser-window';
import { startRecord, stopRecord } from './record';
import { getFolder } from './config';
import globby from 'globby';

import {
  NOTIFICATION,
  IMAGES_REQUEST,
  IMAGES_RESPONSE,
  DELETE_IMAGE,
  UPDATE_IMAGES
} from './../shared/constants';

let log = console.log.bind(console);
let mainWindow = null;

export const emit = (event, body) => mainWindow.webContents.send(event, body);
export const notify = text => {
  log(text);
  emit(NOTIFICATION, { text });
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
    { key: 'super+a', fn: startRecord },
    { key: 'super+d', fn: stopRecord }
  ];

  hotkeys.forEach(({ key, fn }) => {
    const result = globalShortcut.register(key, fn);
    log(`${key} register success: ${result}`);
  });

  ipcMain.on(IMAGES_REQUEST, (event, arg) => {
    globby(`${getFolder()}/*.gif`)
      .then(res => event.sender.send(IMAGES_RESPONSE, res));
  });

  ipcMain.on(DELETE_IMAGE, (event, file) => {
    fs.unlinkSync(file);
    emit(UPDATE_IMAGES);
  });
});

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});
