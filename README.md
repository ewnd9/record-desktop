# record-desktop

Record gifs and take screenshots on linux, built with electron.

![Demonstration](/media/demo.gif?raw=true)

Tested on Ubuntu 14.04 and Ubuntu 16.04 in `unity` and `awesome-wm` environments.

### Featuring

- Recording a gif
  1. Start recording an area or an active window by a hotkey.
  1. Stop by a hotkey, get a generated gif file opened via `xdg-open` (commonly in a image viewer).
  1. Drag & drop it into an input in a browser (currently there is a problem with copy/paste to/from the clipboard, follow [issue#8](https://github.com/ewnd9/record-desktop/issues/8) for details).
- Taking a screenshot
  1. Take a screenshot of an area or an active window by a hotkey (with mac os like shadow - [example](/media/settings-w-shadow.jpg)).
  1. Get a screenshot copied in the clipboard.
  1. Paste it into into an input in a browser.
- Preview gallery
- Upload to imgur

All files are persisted in customizable location.

All hotkeys are customizable in settings.

## Install

First install the dependencies

```sh
$ sudo apt-get install slop imagemagick byzanz
```

If you don't have `apt-get` or have any troubles follow readmes of projects

- [`slop`](https://github.com/naelstrof/slop)
- [`imagemagick`](http://manpages.ubuntu.com/manpages/precise/man1/ImageMagick.1.html)
- [`byzanz`](http://manpages.ubuntu.com/manpages/natty/man1/byzanz-record.1.html)

Then `record-desktop` itself by either Debian package or npm

### Debian package

Download the latest `deb` release from https://github.com/ewnd9/record-desktop/releases

Use `dpkg`

```sh
$ sudo dpkg -i record-desktop_v*_amd64.deb
```

### npm

```sh
$ npm install record-desktop --global
```

## Usage

```sh
$ record-desktop
```

Just put it to autostart

## Development

```sh
$ npm run build:watch
$ npm start
```

## Building production

```sh
$ npm run build:electron-deb && sudo dpkg -i dist-pkg/installers/*.deb
```

## Changelog

- `v0.5.0`
  - make notifications optional
- `v0.4.0`
  - quick actions against latest files in the tray menu
  - auto refresh the gallery on new files creation
  - display size and resolutions of files in the gallery
- `v0.3.0`
  - the mac os like shadow effect for screenshots

## Credits

Icon ([link](http://www.flaticon.com/free-icon/folded-newspaper_12844))
made by [Freepik](http://www.freepik.com) from www.flaticon.com
is licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/).

## Related

- [electron-recorder](https://github.com/mikolalysenko/electron-recorder) - Low-level desktop recorder based on `ffmpeg`
- [archlinux wiki](https://wiki.archlinux.org/index.php/taking_a_screenshot) - List of screenshot apps

## License

MIT © [ewnd9](http://ewnd9.com)
