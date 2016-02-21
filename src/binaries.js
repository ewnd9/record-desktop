import pify from 'pify';

import whereisCallback from 'whereis';
const whereis = bin => pify(whereisCallback)(bin).then(null, err => undefined);

const obj = (name, description) => ({ name, description: (description || '').split('\n') });

const binaries = [
  obj('slop', 'sudo apt-get install slop\nhttps://github.com/naelstrof/slop'),
  obj('xrectsel', 'https://github.com/lolilolicon/xrectsel'),
  obj('xwininfo'),
  obj('xdotool'),
  obj('s'),
  obj('byzanz-record', 'sudo apt-get install byzanz-record'),
  obj('xwd', 'take a screenshot and put in memory'),
  obj('convert', 'take a screenshot from memory into a file')
];

export const getBinaries = () => {
  return Promise
    .all(binaries.map(bin => whereis(bin.name)))
    .then(paths => {
      paths.forEach((path, i) => binaries[i].path = path);
      return binaries;
    });
};

getBinaries()
