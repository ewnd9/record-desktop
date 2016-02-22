import { emit, notify, setIcon } from './main';
import { getFolder } from './config';
import { nativeImage, clipboard } from 'electron';

import recordGif from './wrappers/byzanz-record';
import rectSelect from './wrappers/slop';
import getActive from './wrappers/xwininfo';
import xwd from './wrappers/xwd';
import openFile from './wrappers/xdg-open';

const getOutputFile = ext => `${getFolder()}/${new Date().toISOString()}.${ext}`;

let endFn = null;

const checkIfRunning = () => {
  if (endFn !== null) {
    return Promise.reject('Session is in progress');
  }

  endFn = null;
  return Promise.resolve();
};

const takeGif = ({ width, height, x, y }) => {
  const outputFile = getOutputFile('gif');
  const { promise, finish } = recordGif(outputFile, width, height, x, y);

  notify(`Start`);
  endFn = finish;

  setIcon(true);

  return promise
    .then(() => {
      notify('Generated');
      openFile(outputFile);
    });
};

export const startRecordArea = () => checkIfRunning().then(rectSelect).then(takeGif);
export const startRecordActive = () => checkIfRunning().then(getActive).then(takeGif);

export const stopRecord = () => {
  if (endFn) {
    endFn();
    endFn = null;
    notify('Finish');

    setIcon(false);
  } else {
    notify('Already finished');
  }

  return Promise.resolve(true);
};

export const copyToClipboard = file => {
  const image = nativeImage.createFromPath(file);
  clipboard.writeImage(image);
  notify('Copied to Clipboard');
};

export const screenActive = () => getActive().then(takeScreen);
export const screenArea = () => rectSelect().then(takeScreen);

const takeScreen = ({ x, y, width, height }) => {
  const outputFile = getOutputFile('png');

  return xwd(width, height, x, y, outputFile)
    .then(() => {
      copyToClipboard(outputFile);
    });
}
