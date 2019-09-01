import fs from 'fs';
import path from 'path';
import delay from 'delay';

import { notify } from './logger';
import { getFolder, getScreenshotEffect, eventEmitter } from './config';
import { copyToClipboard, openFile } from './utils';
import { NEW_FILE, SET_APP_ICON } from '../src/shared/constants';

import { recordGifByzanz, selectRegion, takeScreenshot, getActiveWindow } from 'record-desktop';

// per https://github.com/electron/electron/issues/7714#issuecomment-310885608
const x11ScreenshotBinPath = fs.existsSync(path.resolve(`${__dirname}/../../electron.asar`)) ?
  path.resolve(`${__dirname}/../x11-screenshot`) :
  path.resolve(`${__dirname}/../../../scripts/x11-screenshot/x11-screenshot`);

let endFn = null;
let outputFile = null;

export async function startRecordArea() {
  await checkIfRunning();
  const geometry = await selectRegion();
  await takeGif(geometry);
}

export async function startRecordActive() {
  await checkIfRunning();
  const geometry = await getActiveWindow();
  await takeGif(geometry);
}

export async function stopRecord() {
  if (endFn) {
    endFn();
    endFn = null;
    notify('Finish');

    delay(500).then(() => openFile(outputFile));

    eventEmitter.emit(SET_APP_ICON, false);
  } else {
    notify('Already finished');
  }

  return Promise.resolve(true);
}

export async function screenArea() {
  const geometry = await selectRegion();
  await takeScreen(geometry);
}

export async function screenActive() {
  const geometry = await getActiveWindow();
  await takeScreen(geometry);
}

async function takeGif({ width, height, x, y }) {
  outputFile = getOutputFile('gif');
  const promise = recordGifByzanz({ outputFile, width, height, x, y });

  notify(`Start`);
  endFn = () => promise.cancel('external');

  eventEmitter.emit(SET_APP_ICON, true);

  try {
    await promise;

    notify('Generated');
    eventEmitter.emit(NEW_FILE);
  } catch (err) {
    if (err.killed && err.signal === 'SIGINT') {
      notify('Generated');
      eventEmitter.emit(NEW_FILE);
      return;
    }

    return Promise.reject(err);
  }
}

async function takeScreen({ x, y, width, height }) {
  const outputFile = getOutputFile('png');

  await takeScreenshot({ x11ScreenshotBinPath, width, height, x, y, outputFile, effect: getScreenshotEffect() });
  copyToClipboard(outputFile);
  eventEmitter.emit(NEW_FILE);
}

async function checkIfRunning() {
  if (endFn !== null) {
    return Promise.reject('Session is in progress');
  }

  endFn = null;
  return Promise.resolve();
}

function getOutputFile(ext) {
  return `${getFolder()}/${new Date().toISOString()}.${ext}`;
}
