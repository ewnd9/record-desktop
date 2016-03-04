import path from 'path';
import BrowserWindow from 'browser-window';
import notifier from 'node-notifier';
import * as config from './config';

import {
  app,
  globalShortcut,
  Tray,
  ipcMain,
  Menu
} from 'electron';

import {
  NOTIFICATION,
  OPEN_FILE,
  COPY_TO_CLIPBOARD,
  DELETE_FILE,
  UPLOAD
} from './../shared/constants';

import * as registerShortcuts from './shortcuts';
import { log, copyToClipboard, uploadFile, openFile, deleteFile } from './utils';

export const emit = (event, body) => mainWindow.webContents.send(event, body);
export const notify = (text, err) => {
  log(text, err || '');

  notifier.notify({
    title: 'record-desktop',
    message: text + (err ? ' ' + err.message : '')
  });
};

let mainWindow;
let appIcon;

const defaultIcon = path.resolve(__dirname + '/../icon.png');
const recordingIcon = path.resolve(__dirname + '/../icon-recording.png');

export const setIcon = isRecording => appIcon.setImage(isRecording ? recordingIcon : defaultIcon);

process.title = 'record-desktop';
process.on('unhandledRejection', err => {
  log(err.stack);
  notify(err.stack);
});

app.on('ready', () => {
  const indexProd = 'file://' + path.resolve(__dirname, '..', 'public', 'index.html');
  const indexDev = 'file://' + path.resolve(__dirname, '..', 'public', 'index-dev.html');
  const indexHtml = process.env.NODE_ENV === 'production' ? indexProd : indexDev;
  const indexIdle = 'file://' + path.resolve(__dirname, '..', 'public', 'index-idle.html');

  if (process.env.NODE_ENV === 'production') {
    const hasShortcuts = registerShortcuts.hasShortcuts();

    mainWindow = new BrowserWindow({ width: 800, height: 900, show: !hasShortcuts });
    mainWindow.loadURL(indexHtml + '#' + hasShortcuts ? '' : '#');
  } else {
    mainWindow = new BrowserWindow({ width: 1200, height: 400 });
    mainWindow.loadURL(indexHtml);
    mainWindow.openDevTools();
  }

  const offloadContent = () => {
    mainWindow.loadURL(indexIdle);
  };

  mainWindow.on('minimize', () => {
    mainWindow.setSkipTaskbar(true);
    mainWindow.hide();

    offloadContent();
    log('minimize');
  });

  mainWindow.on('restore', () => {
    mainWindow.setSkipTaskbar(false);
    log('restore');
  });

  mainWindow.on('closed', () => mainWindow = appIcon = null);

  appIcon = new Tray(defaultIcon);
  appIcon.on('click', () => {
    log('click appIcon ' + mainWindow.isVisible());

    if (!mainWindow.isVisible()) {
      mainWindow.show();
      mainWindow.loadURL(indexHtml + '#');
    } else {
      mainWindow.hide();
      offloadContent();
    }
  });

  appIcon.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Browse Images',
      click: () => {
        mainWindow.show();
        mainWindow.loadURL(indexHtml + '#');
      }
    },
    {
      label: 'Open a folder',
      click: () => openFile(config.getFolder())
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        mainWindow.show();
        mainWindow.loadURL(indexHtml + '#settings')
      }
    }
  ]));

  ipcMain.on(OPEN_FILE, (event, data) => {
    openFile(data);
  });

  ipcMain.on(COPY_TO_CLIPBOARD, (event, data) => {
    copyToClipboard(data);
  });

  ipcMain.on(DELETE_FILE, (event, data) => {
    deleteFile(data);
  });

  ipcMain.on(UPLOAD, (event, data) => {
    uploadFile(data);
  });

  registerShortcuts.registerAll();
});

app.on('will-quit', function() {
  mainWindow = appIcon = null;
  globalShortcut.unregisterAll();
});
