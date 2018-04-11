'use strict';

const { ffmpeg } = require('../src/unix-utils/ffmpeg');

const outputFile = '/tmp/1.mkv';
const { promise, finish } = ffmpeg({ outputFile, width: 200, height: 200, x: 0, y: 0 });

promise
  .catch(err => console.log(err.stack || err));

setTimeout(() => {
  finish();
  console.log(outputFile);
}, 5000)
