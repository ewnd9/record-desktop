import winston from 'winston';
import { dialog } from 'electron';

import fs from 'fs';

import { nativeImage, clipboard } from 'electron';
import { notify } from './main';

export openFile from './unix-utils/wrappers/xdg-open';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: '/tmp/record-desktop' })
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
