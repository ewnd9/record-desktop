# record-desktop

Record gifs and take screenshots on linux, built with electron.

![Demonstration](/media/demo.gif?raw=true)

Tested on Ubuntu 14.04 in `unity` and `awesome-wm` environments.

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

```
$ sudo add-apt-repository ppa:nilarimogard/webupd8 && sudo apt-get update
$ sudo apt-get install slop imagemagick byzanz
$ npm install record-desktop -g
```

:warning: `nilarimogard/webupd8` is needed for the `slop` package,
check http://www.webupd8.org/ to know more about webupd8. If you don't want to add
external repository, install `slop` from sources from a link below

If you don't have `apt-get` or have any troubles follow readmes of projects

- [`slop`](https://github.com/naelstrof/slop)
- [`imagemagick`](http://manpages.ubuntu.com/manpages/precise/man1/ImageMagick.1.html)
- [`byzanz`](http://manpages.ubuntu.com/manpages/natty/man1/byzanz-record.1.html)

## Usage

```
$ record-desktop
```

Just put it to autostart

## Development

```
$ npm run build:watch
$ npm start
```

## Changelog

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

## License

MIT © [ewnd9](http://ewnd9.com)
