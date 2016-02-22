import path from 'path';
import fs from 'fs';
import BrowserWindow from 'browser-window';

import openFile from './wrappers/xdg-open';
import { getFolder } from './config';
import globby from 'globby';
import winston from 'winston';

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

import * as registerShortcuts from './register-shortcuts';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: '/tmp/journal' })
  ]
});

const log = logger.info.bind(logger);

export const emit = (event, body) => mainWindow.webContents.send(event, body);
export const notify = (text, err) => {
  log(text, err || '');
  emit(NOTIFICATION, { text });
};

let mainWindow;
let appIcon;

const defaultIcon = path.resolve(__dirname + '/../icon.png');
const recordingIcon = path.resolve(__dirname + '/../icon-recording.png');

export const setIcon = isRecording => appIcon.setImage(isRecording ? recordingIcon : defaultIcon);

process.title = 'Journal';
process.on('unhandledRejection', err => {
  console.log(err.stack);
});

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

  mainWindow.on('minimize', () => mainWindow.setSkipTaskbar(true));
  mainWindow.on('restore', () => mainWindow.setSkipTaskbar(false));
  mainWindow.on('closed', () => mainWindow = appIcon = null);

  appIcon = new Tray(defaultIcon);
  appIcon.on('click', () => {
    log('click appIcon');
    mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.minimize()
  });

  registerShortcuts.registerAll();

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
  mainWindow = appIcon = null;
  globalShortcut.unregisterAll();
});
