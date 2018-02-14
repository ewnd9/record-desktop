var main =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1).versions.Keybinder = '3.0';

const GObject = __webpack_require__(2);
const Gtk = __webpack_require__(3);
const Keybinder = __webpack_require__(4);

const { selectRegion, takeScreenshot } = __webpack_require__(5);

const Keyboard = GObject.registerClass(
  {},
  class Keyboard extends Gtk.ApplicationWindow {
    _init(params) {
      super._init(params);

      const hotkey = '<Super>G';
      Keybinder.init();

      const res = Keybinder.bind(hotkey, async () => {
        print(`${hotkey} start`);
        const outputFile = '/tmp/1.png';

        const { width, height, x, y } = await selectRegion();
        await takeScreenshot({ width, height, x, y, outputFile });

        print(`${hotkey} click`, outputFile);
      });

      print(hotkey, res);
    }
  }
);

const RecordDesktopGtkApplication = GObject.registerClass(
  {},
  class RecordDesktopGtkApplication extends Gtk.Application {
    vfunc_activate() {
      this.keyboard = new Keyboard({ application: this });
    }
  }
);

new RecordDesktopGtkApplication().run([]);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = imports.gi;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = imports.gi.GObject;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = imports.gi.Gtk;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = imports.gi.Keybinder;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const execa = __webpack_require__(6);
const PCancelable = __webpack_require__(8);

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

async function takeScreenshot({ outputFile, width, height, x, y, effect }) {
  // derived from from https://github.com/ewnd9/dotfiles/blob/72218bd63c0d44b0e74c1a346625cbdc1f44bb40/dropshadow.sh (MIT)
  const shadow = '\\( +clone -background black -shadow 80x20+0+15 \\) +swap -background transparent -layers merge +repage';
  return execa.shell(`xwd -silent -root | convert xwd:- -crop ${width}x${height}+${x}+${y} ${effect === 'shadow' ? shadow : ''} ${outputFile}`);
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const GLib = __webpack_require__(7);

module.exports = {
  shell,
  stdout
};

// @TODO: change to async
// http://devdocs.baznga.org/glib20~2.50.0/glib.spawn_command_line_sync
// http://devdocs.baznga.org/glib20~2.50.0/glib.spawn_command_line_async
async function shell(cmd) {
  const [, out] = GLib.spawn_command_line_sync(`bash -c "${cmd}"`);
  return Promise.resolve(out.toString());
}

// @TODO: change to async
// http://devdocs.baznga.org/glib20~2.50.0/glib.spawn_sync
// http://devdocs.baznga.org/glib20~2.50.0/glib.spawn_async
async function stdout(cmd, args = [],) {
  const [, out] = GLib.spawn_sync(null, [cmd, ...args], null, GLib.SpawnFlags.SEARCH_PATH, null);
  return Promise.resolve(out.toString());
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = imports.gi.GLib;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class CancelError extends Error {
	constructor() {
		super('Promise was canceled');
		this.name = 'CancelError';
	}

	get isCanceled() {
		return true;
	}
}

class PCancelable {
	static fn(userFn) {
		return function () {
			const args = [].slice.apply(arguments);
			return new PCancelable((resolve, reject, onCancel) => {
				args.push(onCancel);
				userFn.apply(null, args).then(resolve, reject);
			});
		};
	}

	constructor(executor) {
		this._cancelHandlers = [];
		this._isPending = true;
		this._isCanceled = false;

		this._promise = new Promise((resolve, reject) => {
			this._reject = reject;

			return executor(
				value => {
					this._isPending = false;
					resolve(value);
				},
				error => {
					this._isPending = false;
					reject(error);
				},
				handler => {
					this._cancelHandlers.push(handler);
				}
			);
		});
	}

	then(onFulfilled, onRejected) {
		return this._promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		return this._promise.catch(onRejected);
	}

	finally(onFinally) {
		return this._promise.finally(onFinally);
	}

	cancel() {
		if (!this._isPending || this._isCanceled) {
			return;
		}

		if (this._cancelHandlers.length > 0) {
			try {
				for (const handler of this._cancelHandlers) {
					handler();
				}
			} catch (err) {
				this._reject(err);
			}
		}

		this._isCanceled = true;
		this._reject(new CancelError());
	}

	get isCanceled() {
		return this._isCanceled;
	}
}

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);

module.exports = PCancelable;
module.exports.CancelError = CancelError;


/***/ })
/******/ ]);