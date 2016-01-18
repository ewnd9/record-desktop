import { emit, notify } from './main';
import { recordGif, rectSelect, exec, getActive } from './exec';
import { getFolder } from './config';
import { UPDATE_IMAGES } from './../shared/constants';
import { nativeImage, clipboard } from 'electron';

const getOutFile = ext => `${getFolder()}/${new Date().toISOString()}.${ext}`;

let endFn = null;

const checkIfRunning = cb => {
  if (endFn !== null) {
    return Promise.reject('Session is in progress');
  }

  endFn = () => {};
  return Promise.resolve();
};

const takeGif = ({ width, height, x, y }) => {
  const { promise, finish } = recordGif(getOutFile('gif'), width, height, x, y);

  notify(`Start`);
  endFn = finish;

  return promise
    .then(() => {
      notify('Generated');
      emit(UPDATE_IMAGES);
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
  const outFile = getOutFile('png');

  return exec(`xwd -silent -root | convert - -crop ${width}x${height}+${x}+${y} ${outFile}`)
    .then(() => {
      copyToClipboard(outFile);
      emit(UPDATE_IMAGES);
    });
}
