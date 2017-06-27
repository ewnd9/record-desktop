#!/bin/sh

set -e

npm install
npm run build

rm -rf node_modules
npm install --production # prevent packaging devDependencies

npm install electron-packager electron-installer-debian

npm run build:electron-deb

release=$(echo $TRAVIS_TAG | awk '{print substr($1,2);}')

src="dist-pkg/installers/record-desktop_${release}_amd64.deb"
dst="dist-pkg/installers/record-desktop_${TRAVIS_TAG}_amd64.deb"

mv $src $dst
