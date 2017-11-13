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
  }
};

module.exports = config;