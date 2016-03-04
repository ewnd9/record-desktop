import Configstore from 'configstore';

const conf = new Configstore('record-desktop', { isFirstRun: true });
export const path = conf.path;

export const getFolder = () => conf.get('folder');
export const setFolder = folder => conf.set('folder', folder);

export const getCombo = action => conf.get(`combo-${action}`);
export const setCombo = (action, combo) => conf.set(`combo-${action}`, combo);

export const getScreenshotEffect = () => conf.get('screenshot-effect');
export const setScreenshotEffect = value => conf.set('screenshot-effect', value);

if (typeof getScreenshotEffect() === 'undefined') {
  setScreenshotEffect('shadow');
}
