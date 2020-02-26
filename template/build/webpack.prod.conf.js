'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('./config');
const path = require('path');
const utils = require('./utils');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].css')
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ],
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        icon: {
          name: 'icon',
          chunks: 'all',
          minChunks: 1,
          minSize: 0,
          test: /\biconfont\.css$/,
          priority: 2
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          minSize: 0,
          priority: 1,
          test(module) {
            return module.constructor.name === 'CssModule'
          }
        }
      }
    }
  }
});

module.exports = webpackConfig;
