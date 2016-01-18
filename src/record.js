import { emit, notify } from './main';
import { recordGif, rectSelect, exec, getActive, openFile } from './exec';
import { getFolder } from './config';
import { UPDATE_IMAGES } from './../shared/constants';
import { nativeImage, clipboard } from 'electron';

const getOutputFile = ext => `${getFolder()}/${new Date().toISOString()}.${ext}`;

let endFn = null;

const checkIfRunning = cb => {
  if (endFn !== null) {
    return Promise.reject('Session is in progress');
  }

  endFn = () => {};
  return Promise.resolve();
};

const takeGif = ({ width, height, x, y }) => {
  const outputFile = getOutputFile('gif');
  const { promise, finish } = recordGif(outputFile, width, height, x, y);

  notify(`Start`);
  endFn = finish;

  return promise
    .then(() => {
      notify('Generated');
      emit(UPDATE_IMAGES);

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

  return exec(`xwd -silent -root | convert - -crop ${width}x${height}+${x}+${y} ${outputFile}`)
    .then(() => {
      copyToClipboard(outputFile);
      emit(UPDATE_IMAGES);
    });
}
