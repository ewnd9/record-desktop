import Configstore from 'configstore';

const conf = new Configstore('journal-desktop', { isFirstRun: true });
export const path = conf.path;

export const getFolder = () => conf.get('folder');
export const setFolder = folder => conf.set('folder', folder);

export const getCombo = action => conf.get(`combo-${action}`);
export const setCombo = (action, combo) => conf.set(`combo-${action}`, combo);
