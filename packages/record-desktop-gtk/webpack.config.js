const path = require('path');

module.exports = {
  entry: {
    main: `${__dirname}/src/index.js`,
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist`,
    libraryTarget: 'var',
    library: '[name]'
  },
  resolve: {
    alias: {
      'execa': `${__dirname}/src/execa-mock.js`
    },
    modules: [
      'node_modules'
    ]
  },
  externals: {
    'gi': 'imports.gi',
    'gi/GLib': 'imports.gi.GLib',
    'gi/GObject': 'imports.gi.GObject',
    'gi/Gtk': 'imports.gi.Gtk',
    'gi/Keybinder': 'imports.gi.Keybinder'
  }
};
