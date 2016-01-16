var path = require('path');
var webpack = require('webpack');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var NODE_ENV = process.env.NODE_ENV || 'development';

var plugins = [
  new webpack.DefinePlugin({
    'process.env': { 'NODE_ENV': JSON.stringify(NODE_ENV) }
  }),
  new webpack.ProvidePlugin({
    'Promise': 'bluebird',
    'window.Promise': 'bluebird'
  }),
  new webpack.IgnorePlugin(new RegExp("^(fs|electron-prebuilt)$"))
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

var config = {
  entry: {
    app: './frontend/main.js'
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map',
    path: './public'
  },
  resolve: {
    root: [
      path.join(__dirname, 'frontend'),
      path.join(__dirname, 'node_modules'),
    ],
    moduleDirectories: [
      'node_modules'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]"
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  plugins: plugins,
  devServer: {
    contentBase: "./public",
    noInfo: true, //  --no-info option
    hot: false,
    inline: true,
    historyApiFallback: true
  }
};

config.target = webpackTargetElectronRenderer(config);
module.exports = config;
