import path from 'path';
import fs from 'fs';
import BrowserWindow from 'browser-window';

import { openFile } from './exec';
import { getFolder } from './config';
import globby from 'globby';

import {
  app,
  globalShortcut,
  ipcMain,
  nativeImage,
  clipboard,
  Tray
} from 'electron';

import {
  startRecordArea,
  startRecordActive,
  stopRecord,
  screenArea,
  screenActive,
  copyToClipboard,
} from './record';

import {
  NOTIFICATION,
  IMAGES_REQUEST,
  IMAGES_RESPONSE,
  DELETE_IMAGE,
  UPDATE_IMAGES,
  COPY_TO_CLIPBOARD,
  OPEN_FILE
} from './../shared/constants';

export const emit = (event, body) => mainWindow.webContents.send(event, body);
export const notify = (text, err) => {
  log(text, err || '');
  emit(NOTIFICATION, { text });
};

let mainWindow;
let appIcon;
let log = console.log.bind(console);

process.title = 'Journal';

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    mainWindow = new BrowserWindow({ width: 800, height: 900 });
    mainWindow.loadURL('file://' + path.resolve(__dirname, '..', 'public', 'index.html'));
    mainWindow.minimize();
  } else {
    mainWindow = new BrowserWindow({ width: 1200, height: 900 });
    mainWindow.loadURL('file://' + path.resolve(__dirname, '..', 'public', 'index-dev.html'));
    mainWindow.openDevTools();
  }

  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.on('minimize', () => mainWindow.setSkipTaskbar(true));
  mainWindow.on('restore', () => mainWindow.setSkipTaskbar(false));

  appIcon = new Tray(path.resolve(__dirname + '/../icon.png'));
  appIcon.on('click', () => mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.minimize());

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

  ipcMain.on(COPY_TO_CLIPBOARD, (event, file) => copyToClipboard(file));
  ipcMain.on(OPEN_FILE, (event, file) => openFile(file));
});

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});
