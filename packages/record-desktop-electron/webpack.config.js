'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(NODE_ENV),
      'APP_DIR': JSON.stringify(__dirname)
    }
  }),
  new webpack.ProvidePlugin({
    'Promise': 'bluebird',
    'window.Promise': 'bluebird'
  })
];

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  plugins.push(
     new UglifyJsPlugin()
  );
}

var config = {
  entry: {
    app: './src/renderer/main.js'
  },
  devtool: isProd ? 'source-map' : 'cheap-module-source-map',
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map',
    path: __dirname + '/public'
  },
  resolve: {
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: function(file) {
          return file.indexOf('.css') > -1 && file.indexOf('components') === -1;
        },
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: function(file) {
          return file.indexOf('.css') > -1 && file.indexOf('components') > -1;
        },
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ]
      },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  plugins,
  target: 'electron-renderer',
  devServer: {
    contentBase: "./public",
    noInfo: true, //  --no-info option
    hot: false,
    inline: true,
    historyApiFallback: true
  }
};

module.exports = config;
