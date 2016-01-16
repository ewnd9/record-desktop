import { emit, notify } from './main';
import { recordGif, rectSelect } from './exec';
import { getFolder } from './config';
import { UPDATE_IMAGES } from './../shared/constants';

let endFn = null;

export const startRecord = () => {
  if (endFn !== null) {
    notify('session in progress');
    return;
  }

  endFn = () => {};

  rectSelect()
    .then(([ width, height, x, y ]) => {
      const output = `${getFolder()}/${new Date().toISOString()}.gif`;
      const { promise, finish } = recordGif(output, width, height, x, y);

      notify(`Start`);
      endFn = finish;

      return promise;
    })
    .then(() => {
      notify('Generated');
      emit(UPDATE_IMAGES);
    })
    .catch(err => notify('Err: ' + err));
};

export const stopRecord = () => {
  if (endFn) {
    endFn();
    endFn = null;
    notify('Finish');
  } else {
    notify('Already finished');
  }
};
