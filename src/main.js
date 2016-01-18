import path from 'path';
import fs from 'fs';
import { app, globalShortcut, ipcMain, nativeImage, clipboard } from 'electron';
import BrowserWindow from 'browser-window';
import {
  startRecordArea,
  startRecordActive,
  stopRecord,
  screenArea,
  screenActive,
  copyToClipboard,
} from './record';
import { getFolder } from './config';
import globby from 'globby';

import {
  NOTIFICATION,
  IMAGES_REQUEST,
  IMAGES_RESPONSE,
  DELETE_IMAGE,
  UPDATE_IMAGES,
  COPY_TO_CLIPBOARD
} from './../shared/constants';

let log = console.log.bind(console);
let mainWindow = null;

process.title = 'Journal';

export const emit = (event, body) => mainWindow.webContents.send(event, body);
export const notify = (text, err) => {
  log(text, err || '');
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
    { key: 'super+a', fn: startRecordArea },
    { key: 'super+z', fn: startRecordActive },
    { key: 'super+d', fn: stopRecord },
    { key: 'super+s', fn: screenArea },
    { key: 'super+x', fn: screenActive }
  ];

  hotkeys.forEach(({ key, fn }) => {
    const result = globalShortcut.register(key, () => {
      console.log(key); // it won't work if i delete this line (GC?)
      return fn().catch(err => notify('Error', err));
    });
    log(`${key} register success: ${result}`);
  });

  ipcMain.on(IMAGES_REQUEST, (event, arg) => {
    globby([`${getFolder()}/*\.gif`, `${getFolder()}/*\.png`])
      .then(res => event.sender.send(IMAGES_RESPONSE, res));
  });

  ipcMain.on(DELETE_IMAGE, (event, file) => {
    fs.unlinkSync(file);
    emit(UPDATE_IMAGES);
  });

  ipcMain.on(COPY_TO_CLIPBOARD, (event, file) => {
    if (/\.gif/.test(file)) {
      notify('Gif Clipboard is not Supported');
    } else {
      copyToClipboard(file);
    }
  });
});

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});
