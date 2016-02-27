import path from 'path';
import BrowserWindow from 'browser-window';

import openFile from './wrappers/xdg-open';
import * as config from './config';

import {
  app,
  globalShortcut,
  Tray,
  Menu
} from 'electron';

import { NOTIFICATION } from './../shared/constants';

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
  } else {
    mainWindow = new BrowserWindow({ width: 1200, height: 900 });
    mainWindow.loadURL('file://' + path.resolve(__dirname, '..', 'public', 'index-dev.html'));
    mainWindow.openDevTools();
  }

  mainWindow.on('minimize', () => {
    mainWindow.setSkipTaskbar(true)
    log('minimize');
  });

  mainWindow.on('restore', () => {
    mainWindow.setSkipTaskbar(false);
    log('restore');
  })


  mainWindow.on('closed', () => mainWindow = appIcon = null);

  appIcon = new Tray(defaultIcon);
  appIcon.on('click', () => {
    log('click appIcon ' + mainWindow.isVisible());

    if (!mainWindow.isVisible()) {
      mainWindow.show();
    } else {
      mainWindow.hide();
    }
  });

  appIcon.setContextMenu(Menu.buildFromTemplate([
    { label: 'Browse Images', click: () => openFile(config.getFolder()) },
    { type: 'separator' },
    { label: 'Settings', click: () => mainWindow.show() }
  ]));

  registerShortcuts.registerAll();
});

app.on('will-quit', function() {
  mainWindow = appIcon = null;
  globalShortcut.unregisterAll();
});
