'use strict';

const GLib = require('gi/GLib');

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
