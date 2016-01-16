import { notify } from './main';
import { recordGif, rectSelect } from './exec';

let g = null;

export const startRecord = () => {
  if (g !== null) {
    notify('session in progress');
    return;
  }

  g = () => {};

  rectSelect()
    .then(([ width, height, x, y ]) => {
      const output = `${new Date().toISOString()}.gif`;
      const { promise, finish } = recordGif(output, width, height, x, y);

      notify('Start');
      g = finish;

      return promise;
    })
    .then(() => notify('Generated'))
    .catch(err => notify('Err: ' + err));
};

export const stopRecord = () => {
  if (g) {
    g();
    g = null;
    notify('Finish');
  } else {
    notify('Already finished');
  }
};
