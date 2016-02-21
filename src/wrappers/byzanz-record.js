import { exec } from './utils';
import createFifo from './mkfifo';

export default function byzanzRecord(outputFile, width, height, x, y) {
  const { file, onEnd } = createFifo();

  const cmd = 'byzanz-record';

  const catCmd = ['-e', `"cat ${file}"`];
  const gifFile = outputFile;
  const coords = typeof width === 'undefined' ? [] : [
    `--x=${x}`,
    `--y=${y}`,
    `--width=${width}`,
    `--height=${height}`
  ];

  const args = catCmd.concat(coords).concat(gifFile);
  const f = [cmd].concat(args).join(' ');

  return {
    promise: exec(f),
    finish: onEnd,
    command: f
  };
};
