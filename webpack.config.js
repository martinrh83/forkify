var path = require('path');
var webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/js/index.js'],
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  plugins: [new htmlWebpackPlugin({
    filename: 'index.html',
    template: './src/index.html'
  })]
}