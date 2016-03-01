'use strict';

const x11 = require('x11');

const openFile = require('../dist/unix-utils/wrappers/xdg-open').default;
const recordGif = require('../dist/unix-utils/wrappers/byzanz-record').default;
const getFolder = require('../dist/config').getFolder;

const getOutputFile = ext => `${getFolder()}/${new Date().toISOString()}.${ext}`;

const noKeyModifier = 0;

const pointerMode = false;
const keyboardMode = true;

x11.createClient(function(err, display) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const X = display.client;
  const root = display.screen[0].root;

  X.GrabKey(root, 0, noKeyModifier, 52, pointerMode, keyboardMode); // z
  X.GrabKey(root, 0, noKeyModifier, 53, pointerMode, keyboardMode); // x
}).on('event', function(event) {
  const keycode = event.keycode;

  if (event.name === 'KeyPress') {
    if (keycode === 52) {
      console.log('z');
      takeGif();
    } else {
      console.log('x');
      stopRecord();
    }
  }
});

let onEnd;

const takeGif = () => {
  const outputFile = getOutputFile('gif');
  const result = recordGif(outputFile, 1920, 1080, 0, 0);

  onEnd = result.finish;

  return result.promise
    .then(() => {
      openFile(outputFile);
    });
};

const stopRecord = () => {
  onEnd();
};
