import path from 'path';
import fs from 'fs';
import BrowserWindow from 'browser-window';

import openFile from './wrappers/xdg-open';
import * as config from './config';
import globby from 'globby';

import {
  app,
  globalShortcut,
  ipcMain,
  nativeImage,
  clipboard,
  dialog,
  Tray,
  Menu
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
  OPEN_FILE,
  SELECT_FOLDER,
  UPDATE_FOLDER
} from './../shared/constants';

import * as registerShortcuts from './register-shortcuts';
import { log } from './utils';

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
  log(err.stack);
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    mainWindow = new BrowserWindow({ width: 800, height: 900, show: false });
    mainWindow.loadURL('file://' + path.resolve(__dirname, '..', 'public', 'index.html'));
    mainWindow.minimize();
  } else {
    mainWindow = new BrowserWindow({ width: 1200, height: 900 });
    mainWindow.loadURL('file://' + path.resolve(__dirname, '..', 'public', 'index-dev.html'));
    mainWindow.openDevTools();
  }

  mainWindow.on('minimize', () => {
    mainWindow.setSkipTaskbar(true)
    log('minimize');
  });

  mainWindow.on('closed', () => mainWindow = appIcon = null);

  appIcon = new Tray(defaultIcon);
  appIcon.on('click', () => {
    log('click appIcon ' + mainWindow.isMinimized());

    if (mainWindow.isMinimized()) {
      mainWindow.show();
      mainWindow.setSkipTaskbar(false);

      log('restore');
    } else {
      mainWindow.minimize();
    }
  });

  appIcon.setContextMenu(Menu.buildFromTemplate([
    { label: 'Browse Images', click: () => openFile(config.getFolder()) },
    { type: 'separator' },
    { label: 'Settings', click: () => mainWindow.restore() }
  ]));

  registerShortcuts.registerAll();

  ipcMain.on(COPY_TO_CLIPBOARD, (event, file) => copyToClipboard(file));
  ipcMain.on(OPEN_FILE, (event, file) => openFile(file));
  ipcMain.on(SELECT_FOLDER, event => {
    const result = dialog.showOpenDialog({ properties: [ 'openDirectory' ] });

    if (result) {
      config.setFolder(result[0]);
      event.sender.send(UPDATE_FOLDER);
    }
  })
});

app.on('will-quit', function() {
  mainWindow = appIcon = null;
  globalShortcut.unregisterAll();
});
