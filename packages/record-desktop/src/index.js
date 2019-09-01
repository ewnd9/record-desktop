'use strict';

const execa = require('execa');
const PCancelable = require('p-cancelable');

module.exports = {
  recordGif,
  recordGifByzanz,
  selectRegion,
  selectRegionSlop,
  selectRegionXrectsel,
  openFile,
  takeScreenshot,
  getActiveWindow
};

function recordGif({ outputFile, width, height, x, y }) {
  return recordGifByzanz({ outputFile, width, height, x, y });
}

function recordGifByzanz({ outputFile, width, height, x, y }) {
  return new PCancelable((resolve, reject, onCancel) => {
    const coords = typeof width === 'undefined' ? [] : [
      `--x=${x}`,
      `--y=${y}`,
      `--width=${width}`,
      `--height=${height}`
    ];

    const args = coords.concat(outputFile);
    const proc = execa.shell(`byzanz-record ${args.join(' ')}`); // shell is needed for internal byzanz forking

    proc.then(resolve, reject);

  	onCancel.shouldReject = false;
    onCancel(() => proc.kill('SIGINT'));
  });
}

async function selectRegion() {
  return selectRegionSlop(); // @TODO backfall to xrectsel on slop missing
}

async function selectRegionSlop() {
  const stdout = await execa.stdout('slop', ['-f', '%g']);

  if (/^\d+x\d+\+\d+\+\d+/.test(stdout)) {
    const [dim, x, y] = stdout.split('+');
    const [width, height] = dim.split('x');

    return { width, height, x, y };
  } else {
    const [x, y, width, height] = stdout.split('\n').map(_ => _.split('=')[1]);
    return { width, height, x, y };
  }
}

async function selectRegionXrectsel() {
  const stdout = await execa.stdout('xrectsel');
  const [width, height, x, y] = stdout.split(/[\+x]+/);
  return { width, height, x, y };
}

async function openFile(file) {
  return execa('xdg-open', [file]);
}

async function takeScreenshot({ x11ScreenshotBinPath, outputFile, width, height, x, y, effect }) {
  // derived from from https://github.com/ewnd9/dotfiles/blob/72218bd63c0d44b0e74c1a346625cbdc1f44bb40/dropshadow.sh (MIT)
  const shadow = '\\( +clone -background black -shadow 80x20+0+15 \\) +swap -background transparent -layers merge +repage';

  await execa(x11ScreenshotBinPath, [outputFile]);
  await execa.shell(`convert ${outputFile} -crop ${width}x${height}+${x}+${y} ${effect === 'shadow' ? shadow : ''} ${outputFile}`);
}

async function getActiveWindow() {
  const stdout = await execa.shell(`xwininfo -id $(xdotool getactivewindow)`);
  const lines = stdout.split('\n').reduce((acc, line) => {
    const [left, right] = line.trim().split(':');

    if (!right) {
      return acc;
    }

    acc[left] = right.trim();
    return acc;
  }, {});

  return {
    x: +lines['Absolute upper-left X'],
    y: +lines['Absolute upper-left Y'],
    width: +lines['Width'],
    height: +lines['Height']
  }
}
