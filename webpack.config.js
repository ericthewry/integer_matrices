var webpack = require("webpack");

module.exports = {
  entry: ['./index.js'],
  output: {
    path: './',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ["", ".js"],
    moduleDirectories: ["js", "node_modules"]
  },
  module: {
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  }
};