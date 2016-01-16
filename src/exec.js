import { exec as execAsync, execSync, spawn as spawnAsync } from 'child_process';
import path from 'path';

export const exec = (cmd) => {
  return new Promise((resolve, reject) => {
    execAsync(cmd, (err, stdout, stderr) => {
      if (err) {
        reject({ error, stderr });
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

export const spawn = (cmd, args) => {
  return new Promise((resolve, reject) => {
    const proc = spawnAsync(cmd, args);

    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on('exit', () => resolve());
  });
};

export const createFifo = () => {
  const file = `/tmp/fifo-${Math.random()}`;
  execSync(`rm -f ${file} && mkfifo ${file}`);

  const proc = spawnAsync(`sh`, [path.resolve(__dirname, '..', 'cat.sh'), file]);
  const onEnd = () => proc.kill();

  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);

  return { onEnd, file };
};

export const recordGif = (outputFile, width, height, x, y) => {
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

export const rectSelect = (outputName) => {
  return exec(`xrectsel`).then(res => res.split(/[\+x]+/));
};
