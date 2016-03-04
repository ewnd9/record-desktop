import { emit, notify, setIcon } from './main';
import { getFolder, getScreenshotEffect } from './config';
import { copyToClipboard, openFile } from './utils';

import recordGif from './unix-utils/wrappers/byzanz-record';
import rectSelect from './unix-utils/wrappers/slop';
import getActive from './unix-utils/wrappers/xwininfo';
import xwd from './unix-utils/wrappers/xwd';

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

export const screenActive = () => getActive().then(takeScreen);
export const screenArea = () => rectSelect().then(takeScreen);

const takeScreen = ({ x, y, width, height }) => {
  const outputFile = getOutputFile('png');

  return xwd(width, height, x, y, outputFile, getScreenshotEffect())
    .then(() => {
      copyToClipboard(outputFile);
    });
}
