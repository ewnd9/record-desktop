import path from 'path';
import saveFile from 'electron-save-file';

import {
  BrowserWindow,
  Tray,
  Menu
} from 'electron';

import { log } from './logger';
import { uploadFile, openFile, deleteFile, getFiles } from './utils';
import * as registerShortcuts from './shortcuts';
import * as config from './config';

export default class WindowHolder {
  constructor(app) {
    this.app = app;

    this.indexProd = 'file://' + path.resolve(__dirname, '..', 'public', 'index.html');
    this.indexDev = 'file://' + path.resolve(__dirname, '..', 'public', 'index-dev.html');
    this.indexHtml = process.env.NODE_ENV === 'production' ? this.indexProd : this.indexDev;
    this.indexIdle = 'file://' + path.resolve(__dirname, '..', 'public', 'index-idle.html');

    this.hasShortcuts = registerShortcuts.hasShortcuts();
    this.initUrl = this.indexHtml + '#' + (this.hasShortcuts ? '' : 'settings');

    this.defaultIcon = path.resolve(__dirname + '/../icon.png');
    this.recordingIcon = path.resolve(__dirname + '/../icon-recording.png');

    this.mainWindow;
    this.appIcon;
    this.updateTrayMenu();
  }

  destroy() {
    this._mainWindow = this._appIcon = null;
  }

  get mainWindow() {
    if (!this._mainWindow) {
      this._mainWindow = this.createWindow();
    }

    return this._mainWindow;
  }

  get appIcon() {
    if (!this._appIcon) {
      this._appIcon = this.createAppIcon();
    }

    return this._appIcon;
  }

  createWindow() {
    let result;

    if (process.env.NODE_ENV === 'production') {
      result = new BrowserWindow({ width: 800, height: 900, show: !this.hasShortcuts });
      result.loadURL(this.initUrl);
    } else {
      result = new BrowserWindow({ width: 1200, height: 400 });
      result.loadURL(this.initUrl);
      result.openDevTools();
    }

    result.on('minimize', () => {
      this.mainWindow.setSkipTaskbar(true);
      this.mainWindow.hide();

      this.offloadContent();
      log('minimize');
    });

    result.on('restore', () => {
      this.mainWindow.setSkipTaskbar(false);
      log('restore');
    });

    result.on('closed', () => {
      this.destroy();
    });

    return result;
  }

  offloadContent() {
    this.mainWindow.loadURL(this.indexIdle);
  };

  sendWebContents(event, body) {
    this.mainWindow.webContents.send(event, body);
  }

  createAppIcon() {
    const result = new Tray(this.defaultIcon);

    result.on('click', () => {
      log('click appIcon ' + this.mainWindow.isVisible());

      if (!this.mainWindow.isVisible()) {
        this.mainWindow.show();
        this.mainWindow.loadURL(this.indexHtml + '#');
      } else {
        this.mainWindow.hide();
        this.offloadContent();
      }
    });

    return result;
  }

  setAppIcon(isRecording) {
    this.appIcon.setImage(isRecording ? this.recordingIcon : this.defaultIcon);
  }

  updateTrayMenu() {
    return getFiles(config.getFolder())
      .then(files => {
        if (!this.appIcon) {
          this.createAppIcon();
        }

        this.appIcon.setContextMenu(Menu.buildFromTemplate([
          {
            label: 'Latest',
            submenu: files.slice(0, 5)
              .map(file => ({
                label: file.filename,
                submenu: [
                  {
                    label: 'Upload to imgur',
                    click: () => uploadFile(file.url)
                  },
                  {
                    label: 'Delete',
                    click: () => deleteFile(file.url)
                  },
                  {
                    label: 'Save as',
                    click: () => saveFile(file.url)
                  }
                ]
              }))
          },
          {
            label: 'Browse Images',
            click: () => {
              this.mainWindow.show();
              this.mainWindow.loadURL(this.indexHtml + '#');
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
              this.mainWindow.show();
              this.mainWindow.loadURL(this.indexHtml + '#settings')
            }
          },
          {
            label: 'Exit',
            click: () => this.app.quit()
          }
        ]));
      })
      .catch(err => log(err.stack))
  }

}
