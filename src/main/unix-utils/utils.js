import { exec as _execAsync, spawn as _spawnAsync } from 'child_process';
export { execSync } from 'child_process';

export openFile from './wrappers/xdg-open';

export const execAsync = _execAsync;
export const spawnAsync = _spawnAsync;

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
  return new Promise(resolve => {
    const proc = spawnAsync(cmd, args);

    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on('exit', () => resolve());
  });
};
