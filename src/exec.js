import { exec as execAsync, execSync, spawn as spawnAsync } from 'child_process';
import path from 'path';

export const exec = (cmd) => {
  return new Promise((resolve, reject) => {
    execAsync(cmd, (err, stdout, stderr) => {
      if (err) {
        reject({ err, stderr });
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

export const rectSelect = () => {
  return exec(`xrectsel`).then(res => {
    const [width, height, x, y] = res.split(/[\+x]+/);
    return { width, height, x, y };
  });
};

export const getActive = () => {
  return exec(`xwininfo -id $(xdotool getactivewindow)`)
    .then(res => {
      const lines = res.split('\n');
      const fn = ind => +(lines[ind].split(':')[1].trim());

      return {
        x: fn(2),
        y: fn(3),
        width: fn(6),
        height: fn(7)
      };
    });
};

export const openFile = file => exec(`xdg-open ${file}`);
