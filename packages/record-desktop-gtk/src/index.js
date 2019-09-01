'use strict';

require('gi').versions.Keybinder = '3.0';

const GObject = require('gi/GObject');
const Gtk = require('gi/Gtk');
const Keybinder = require('gi/Keybinder');

const { selectRegion, takeScreenshot } = require('record-desktop');

const Keyboard = GObject.registerClass(
  {},
  class Keyboard extends Gtk.ApplicationWindow {
    _init(params) {
      super._init(params);

      const hotkey = '<Super>X';
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
