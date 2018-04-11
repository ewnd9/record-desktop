'use strict';

const fs = require('fs');
const execa = require('execa');
const packager = require('electron-packager');
const installer = require('electron-installer-debian');

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function main() {
  const rootDir = process.cwd();
  const dir = `${rootDir}/dist-pkg/minimal`;

  await execa('mkdir', ['-p', dir]);
  await execa('cp', ['-r', 'packages/record-desktop-electron/.', dir]);
  await execa('cp', ['scripts/x11-screenshot/x11-screenshot', dir]);

  const pkg = require(`${dir}/package.json`);
  pkg.name = 'record-desktop';
  pkg.dependencies['record-desktop'] = `file:${rootDir}/packages/record-desktop`;
  fs.writeFileSync(`${dir}/package.json`, JSON.stringify(pkg, null, 2));

  await execa('yarn', ['install'], {cwd: dir});

  await packager({
    dir,
    name: 'record-desktop',
    productName: 'record-desktop',
    executableName: 'record-desktop',
    platform: 'linux',
    arch: 'x64',
    out: 'dist-pkg/',
  });

  await installer({
    src: 'dist-pkg/record-desktop-linux-x64/',
    dest: 'dist-pkg/installers/',
    arch: 'amd64'
  });
}
