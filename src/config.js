import userHome from 'user-home';
import fs from 'fs';
import Configstore from 'configstore';

const conf = new Configstore('journal-desktop', { isFirstRun: true });
export const path = conf.path;

export const getFolder = () => conf.get('folder');
export const setFolder = folder => conf.set('folder', folder);
