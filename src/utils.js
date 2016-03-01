import { exec as _execAsync, spawn as _spawnAsync } from 'child_process';
import winston from 'winston';
import { dialog } from 'electron';
import fs from 'fs';
import { nativeImage, clipboard } from 'electron';
import { notify } from './main';

export openFile from './wrappers/xdg-open';

export const execAsync = _execAsync;
export const spawnAsync = _spawnAsync;

export { execSync } from 'child_process';

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

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: '/tmp/journal' })
  ]
});

export const log = logger.info.bind(logger);

export const selectFolder = () => {
  const result = dialog.showOpenDialog({ properties: [ 'openDirectory' ] });
  return result && result[0];
};

export const getFiles = folder => {
  return fs.readdirSync(folder).sort().reverse().map(filename => ({
    url: folder + '/' + filename,
    filename
  }));
};

export const copyToClipboard = file => {
  const image = nativeImage.createFromPath(file);
  clipboard.writeImage(image);
  notify('Copied to Clipboard');
};
