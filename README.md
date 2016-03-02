# record-desktop

Record gifs and take screenshots on linux, built with electron.

![Demonstration](/demo.gif?raw=true)

Tested on Ubuntu 14.04 in `unity` and `awesome-wm` environments.

### Featuring

- Record an area
- Record an active window
- Take a screenshot of an area
- Take a screenshot of an active window
- Preview gallery
- Upload to imgur

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

## Development

```
$ npm run build:watch
$ npm start
```

## Credits

Icon ([link](http://www.flaticon.com/free-icon/folded-newspaper_12844))
made by [Freepik](http://www.freepik.com) from www.flaticon.com
is licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/).

## License

MIT © [ewnd9](http://ewnd9.com)
