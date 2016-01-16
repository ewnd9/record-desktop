import userHome from 'user-home';
import fs from 'fs';
import mkdirp from 'mkdirp';

export const ensureFolderExists = folder => {
  if (!fs.existsSync(folder)) {
    mkdirp(folder);
  }
};

const folder = userHome + '/Journal';
ensureFolderExists(folder);

export const getFolder = () => folder;
