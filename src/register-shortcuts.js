import {
  globalShortcut,
} from 'electron';

import { emit, notify } from './main';

import {
  startRecordArea,
  startRecordActive,
  stopRecord,
  screenArea,
  screenActive,
  copyToClipboard,
} from './record';

import { getCombo } from './config';

const RECORD_AREA = 'RECORD_AREA';
const RECORD_ACTIVE = 'RECORD_ACTIVE';
const STOP = 'STOP';
const SCREEN_AREA = 'SCREEN_AREA';
const SCREEN_ACTIVE = 'SCREEN_ACTIVE';

const obj = (label, combo) => ({ label, combo });

export const actions = {
  [RECORD_AREA]: obj('Start recording an area', 'super+a'),
  [RECORD_ACTIVE]: obj('Start recording an active window', 'super+z'),
  [STOP]: obj('Stop recording', 'super+d'),
  [SCREEN_AREA]: obj('Take a screenshot of an area', 'super+s'),
  [SCREEN_ACTIVE]: obj('Take a screenshot of an active window', 'super+x')
};

const fnMappings = {
  [RECORD_AREA]: startRecordArea,
  [RECORD_ACTIVE]: startRecordActive,
  [STOP]: stopRecord,
  [SCREEN_AREA]: screenArea,
  [SCREEN_ACTIVE]: screenActive
};

export const register = (action, combo) => {
  if (combo.indexOf('+') === -1) {
    return false;
  }

  try {
    const result = globalShortcut.register(combo, () => {
      console.log(`press ${combo}`); // it won't work if i delete this line (GC?)
      return fnMappings[action]().catch(err => notify('Error', err));
    });

    console.log(`${combo} register success: ${result}`);
    return result;
  } catch (e) {
    return false;
  }
};

export const registerAll = () => {
  Object.keys(fnMappings).forEach(action => {
    const combo = getCombo(action);
    register(action, combo);
  });
};

export const unregister = combo => {
  try {
    return globalShortcut.unregister(combo);
  } catch (e) {
    return false;
  }
};
