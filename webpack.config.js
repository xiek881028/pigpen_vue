/*!
 * Webpack config
 * create: 2018/09/08
 * since: 0.0.1
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const cuid = require('cuid');
const webpack = require('webpack');
const pkg = require('./package.json');

const WebpackMiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const WebpackOptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackUglifyjsPlugin = require('uglifyjs-webpack-plugin');
const WebpackVueLoaderPlugin = require('vue-loader/lib/plugin');

const out_base_path = 'dist';
const in_base_path = 'src';
const base_path = __dirname;
const output_path = `${base_path}/${out_base_path}/js`;

function resolve(dir) {
  return path.join(__dirname, '/', dir);
}

module.exports = (env, argv) => {

  this.prod = argv.mode == 'production';
  this.min = this.prod ? '.min' : '';
  this.cuid = cuid();

  let entries = {
    _common: path.resolve(__dirname, 'src/js/common/app.js'),
  };

  return {
    entry: entries,
    output: {
      path: output_path,
      filename: this.prod ? `[name].${this.cuid}.js` : `[name].js`,
      chunkFilename: this.prod ? `chunk[id].${this.cuid}.js` : 'chunk[id].js',
      publicPath: "js/",
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@root': resolve('/'),
      },
    },
    externals: {
      axios: 'axios',
      vue: 'Vue',
      vuex: 'Vuex',
      json3: 'JSON3',
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          oneOf: [
            {
              loader: 'pug-loader',
              exclude: /\.vue.pug$/,
              options: {
                pretty: false,
              },
            },
            {
              loader: 'pug-plain-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            WebpackMiniCssExtractPlugin.loader,
            'css-loader?sourceMap',
            'postcss-loader?sourceMap',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            WebpackMiniCssExtractPlugin.loader,
            'css-loader?sourceMap',
            'postcss-loader?sourceMap',
            'sass-loader?sourceMap',
          ],
        },
        {
          test: /\.less$/,
          use: [
            WebpackMiniCssExtractPlugin.loader,
            'css-loader?sourceMap',
            'postcss-loader?sourceMap',
            {loader: 'less-loader', options: {javascriptEnabled: true}},
          ],
        },
        {
          test: /\.js?$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.(gif|jpe?g|png)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                fallback: 'file-loader',
                limit: 8192,
                name: '../images/[name].[ext]',
                publicPath: url => {
                  return url;
                }
              },
            },
          ],
        },
        {
          test: /\.(ttc|ttf|woff|eot|svg|woff2|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                fallback: 'file-loader',
                limit: 8192,
                name: '../fonts/[name].[ext]',
                publicPath: url => {
                  return url;
                }
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                loaders: {
                  scss: [
                    WebpackMiniCssExtractPlugin.loader,
                    'css-loader?sourceMap',
                    'postcss-loader?sourceMap',
                    'sass-loader?sourceMap',
                  ],
                  less: [
                    WebpackMiniCssExtractPlugin.loader,
                    'css-loader?sourceMap',
                    'postcss-loader?sourceMap',
                    {loader: 'less-loader', options: {javascriptEnabled: true}},
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new WebpackUglifyjsPlugin({
          parallel: 4,
        }),
        new WebpackOptimizeCSSAssetsPlugin({
          cssProcessorOptions: { discardComments: { removeAll: true } },
        }),
      ],
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new WebpackVueLoaderPlugin(),
      new WebpackMiniCssExtractPlugin({
        chunkFilename: `../css/${this.prod ? `chunk[id].${this.cuid}.css` : `chunk[id].css`}`,
        filename: `../css/${this.prod ? `[name].${this.cuid}.css` : `[name].css`}`,
      }),
    ].concat([
      new WebpackHtmlPlugin({
        title: {
          min: this.min,
          cuid: this.prod ? `.${this.cuid}` : '',
          author: pkg.author,
          keywords: pkg.keywords.join(', '),
          description: pkg.description,
        },
        template: path.resolve(__dirname, 'src/html/index.pug'),
        filename: path.resolve(__dirname, out_base_path, 'index.html'),
        inject: false,
      }),
    ]
    ),
  };
}
