import EventEmitter from 'events';
export const eventEmitter = new EventEmitter();

import Configstore from 'configstore';

const conf = new Configstore('record-desktop', { isFirstRun: true });
export const path = conf.path;

export const getFolder = () => conf.get('folder');
export const setFolder = folder => conf.set('folder', folder);

export const getCombo = action => conf.get(`combo-${action}`);
export const setCombo = (action, combo) => conf.set(`combo-${action}`, combo);

export const getScreenshotEffect = () => conf.get('screenshot-effect');
export const setScreenshotEffect = value => conf.set('screenshot-effect', value);

export const getHasNotifications = () => conf.get('has-notifications');
export const setHasNotifications = value => {
  if (typeof value !== 'boolean') {
    throw new Error('value should be type of boolean');
  }

  conf.set('has-notifications', value)
};

if (typeof getScreenshotEffect() === 'undefined') {
  setScreenshotEffect('shadow');
}

if (typeof getHasNotifications() === 'undefined') {
  setHasNotifications(true);
}
