'use strict';

const path = require('path');

const config = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'holoweb.js'
  },
  module: {
    rules: [
      { test: /\.js$/, include: [path.resolve(__dirname, 'src')], }
    ]
  },
  devtool: "eval-source-map"
};

if (process.env.NODE_ENV === "production") {
  config.output.filename = 'holoweb.min.js';
  config.devtool = "";
}

module.exports = config;