if (process.env.NODE_ENV !== 'development') {
  process.env.NODE_ENV = 'production';
}

import { eventEmitter } from './config';
import WindowHolder from './window-holder';

import { app, globalShortcut, ipcMain } from 'electron';

import {
  OPEN_FILE, COPY_TO_CLIPBOARD, DELETE_FILE,
  UPLOAD, NEW_FILE, SET_APP_ICON
} from '../shared/constants';

import * as registerShortcuts from './shortcuts';
import { copyToClipboard, uploadFile, openFile, deleteFile } from './utils';
import { notify } from './logger';

process.title = 'record-desktop';
process.on('unhandledRejection', err => {
  notify(err.stack || err);
});

let windowHolder;

app.on('ready', () => {
  windowHolder = new WindowHolder(app);

  eventEmitter.on(NEW_FILE, () => {
    windowHolder.updateTrayMenu();
    windowHolder.sendWebContents(NEW_FILE);
  });

  eventEmitter.on(SET_APP_ICON, isRecording => {
    windowHolder.setAppIcon(isRecording);
  });

  ipcMain.on(OPEN_FILE, (event, data) => {
    openFile(data);
  });

  ipcMain.on(COPY_TO_CLIPBOARD, (event, data) => {
    copyToClipboard(data);
  });

  ipcMain.on(DELETE_FILE, (event, data) => {
    deleteFile(data);
    windowHolder.updateTrayMenu();
  });

  ipcMain.on(UPLOAD, (event, data) => {
    uploadFile(data);
  });

  registerShortcuts.registerAll();
});

app.on('will-quit', () => {
  if (windowHolder) {
    windowHolder.destroy();
    windowHolder = null;
  }

  globalShortcut.unregisterAll();
});
