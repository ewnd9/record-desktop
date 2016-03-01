# record-desktop

[WIP] Record gifs and take screenshots on linux. An electron application.

![Demonstration](/demo.gif?raw=true)

Tested on Ubuntu 14.04 in `unity` and `awesome-wm` environments.

## Install

```
$ sudo apt-get install slop imagemagick byzanz
$ npm install record-desktop -g
```

If you don't have `apt-get` or have any troubles follow readmes of projects

- [`slop`](https://github.com/naelstrof/slop)
- [`imagemagick`](http://manpages.ubuntu.com/manpages/precise/man1/ImageMagick.1.html)
- [`byzanz`](http://manpages.ubuntu.com/manpages/natty/man1/byzanz-record.1.html)

## Usage

```
$ record-desktop # put it to autostart
```

## Roadmap

- [x] Gifs/Screenshots Gallery
- [x] Upload to imgur and other online services

## Development

```
$ npm run build:watch # separate terminal
$ npm start
```

## Credits

Icon ([link](http://www.flaticon.com/free-icon/folded-newspaper_12844))
made by [Freepik](http://www.freepik.com) from www.flaticon.com
is licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/).

## License

MIT © [ewnd9](http://ewnd9.com)
