import { dialog } from 'electron';
import pify from 'pify';
import prettyBytes from 'pretty-bytes';

import fs from 'fs';

const stat = pify(fs.stat);
const readdir = pify(fs.readdir);

import imgur from 'imgur';
imgur.setClientId('a9e8e4383e6dfa2');

import { nativeImage, clipboard } from 'electron';
import { notify } from './logger';

export openFile from './unix-utils/wrappers/xdg-open';

export const selectFolder = () => {
  const result = dialog.showOpenDialog({ properties: [ 'openDirectory' ] });
  return result && result[0];
};

export const getFiles = folder => {
  if (!folder) {
    return Promise.resolve([]);
  }

  let files;

  return readdir(folder)
    .then(_files => {
      files = _files;
      return Promise.all(files.map(file => stat(`${folder}/${file}`)));
    })
    .then(stats => {
      stats.forEach((stat, i) => {
        files[i] = {
          url: folder + '/' + files[i],
          filename: files[i],
          mtime: stat.mtime,
          size: prettyBytes(stat.size)
        }
      });

      files.sort((a, b) => b.mtime - a.mtime);
      return files;
    });
};

export const deleteFile = file => {
  return fs.unlinkSync(file);
};

export const copyToClipboard = file => {
  const image = nativeImage.createFromPath(file);
  clipboard.writeImage(image);
  notify('Copied to Clipboard');
};

export const uploadFile = file => {
  notify('Uploading...');

  imgur.uploadFile(file)
    .then(function (json) {
      clipboard.writeText(json.data.link);
      notify('Copied Url to Clipboard');
    });
};
