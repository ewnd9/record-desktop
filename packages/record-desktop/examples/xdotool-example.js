'use strict';

const fs = require('fs');
const delay = require('delay');
const execa = require('execa');
const globby = require('globby');
const prettyBytes = require('pretty-bytes');

const { ffmpeg } = require('../src/unix-utils/ffmpeg');
const { xdotool } = require('../src/unix-utils/xdotool');
const { xwininfo } = require('../src/unix-utils/xwininfo');
const { openTag } = require('../src/unix-utils/wmctrl');
const { xdgOpen } = require('../src/unix-utils/xdg-open');

const devConsole = console;

main()
.catch(err => {
  devConsole.error(err);
  process.exit(1);
});

async function main() {
  const sentence = 'very tired but very cool';
  const typeDelay = 200;
  const outputFile = '/tmp/1.mkv';

  await delay(100);
  await openTag(3);

  await xdotool(['key', 'super+e']);
  await delay(100);

  const { x, y, width, height } = await xwininfo();

  const imgProc = execa('pqiv', ['-c', '-c', '-i', 'snoop.gif']);
  await delay(400);

  const { stdout } = await execa('xdotool', ['search', '--pid', imgProc.pid]);
  const imgWindowId = stdout.split('\n')[1];
  console.log(stdout, imgWindowId);

  for (let i = 0 ; i < 5 ; i++) {
    await execa('wmctrl', ['-i', '-r', imgWindowId, '-e', `0,${x + i * 50},${y + i * 10},250,250`]);
    await delay(200);
  }
  // const { promise, finish } = ffmpeg({ outputFile, x, y, width, height, offset: 50 });

  // await delay(100);
  // await xdotool(['type', '--delay', typeDelay, sentence]);
  // await delay(100);

  // finish();
  // await promise;

  // const dir = `/tmp/${new Date().toISOString()}`;
  // const outputGif = `${dir}/anim.gif`;

  // await execa('mkdir', [dir]);
  // await execa('ffmpeg', ['-i', outputFile, `${dir}/frame%04d.png`]);
  // const frameFiles = await globby(['*.png'], { absolute: true, cwd: dir });
  // const args = ['-o', outputGif].concat(frameFiles);
  // await execa('gifski', args);


  // const stat = fs.statSync(outputGif);
  // console.log(outputGif, prettyBytes(stat.size));

  // xdgOpen(outputGif);
}
