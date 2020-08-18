/*!
 * Webpack config
 * create: 2018/09/08
 * since: 0.0.1
 */
'use strict';

const path = require('path');
const webpack = require('webpack');

const WebpackMiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const WebpackOptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackUglifyjsPlugin = require('uglifyjs-webpack-plugin');
const WebpackVueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = (env, argv) => {

  this.prod = argv.mode == 'production';
  this.min = this.prod ? '.min' : '';

  // vue单文件使用
  let entries = {
    common: path.resolve(__dirname, 'src/js/common/app.js'),
  };

  return {
    mode: argv.mode,
    entry: entries,
    stats: {
      // assets: false,
      // moduleAssets: false,
      // cached: false,
      // cachedAssets: false,
      children: false,
      // chunks: false,
      // chunkGroups: false,
      // chunkModules: false,
      // chunkRootModules: false,
      // chunkOrigins: false,
      // entrypoints: false,
      // loggingTrace: false,
      modules: false,
      moduleTrace: false,
      // performance: false,
      // reasons: false,
      colors: true,
      // children: false,
      // entrypoints: true,
      // moduleAssets: false,
      // chunks: false,
      // chunkGroups: false,
      // cachedAssets: false,
      // reasons: false,
      warningsFilter: [
        // 忽略理由：https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
        'Conflicting order between:',
      ],
    },
    output: {
      path: resolve('dist'),
      // filename: '[name].js',
      // vue单文件使用
      filename: this.prod ? `js/[name].[chunkhash].min.js` : `js/[name].js`,
      chunkFilename: this.prod ? `js/[name].chunk.[chunkhash].min.js` : 'js/[name].chunk.js',
      publicPath: "/",
    },
    resolve: {
      alias: {
        '@src': resolve('src'),
        '@root': resolve('/'),
      },
    },
    externals: {
      axios: 'axios',
      vue: 'Vue',
      vueRouter: 'VueRouter',
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          // use: ['pug-plain-loader'],
          // vue单文件使用
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
          test: /\.less$/,
          use: [
            WebpackMiniCssExtractPlugin.loader,
            'css-loader?sourceMap',
            'postcss-loader?sourceMap',
            {
              loader: 'less-loader', options: {
                lessOptions: { javascriptEnabled: true }
              }
            },
          ],
        },
        {
          test: /\.js?$/,
          use: ['babel-loader'],
          // exclude: /node_modules/,
        },
        {
          test: /\.(gif|jpe?g|png)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                fallback: 'file-loader',
                limit: 8192,
                outputPath: 'images/',
                // name: '../images/[name].[ext]',
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
                outputPath: 'fonts/',
                // name: '../fonts/[name].[ext]',
                // publicPath: url => {
                //   return url;
                // }
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
                  less: [
                    WebpackMiniCssExtractPlugin.loader,
                    'css-loader?sourceMap',
                    'postcss-loader?sourceMap',
                    { loader: 'less-loader', options: { javascriptEnabled: true } },
                  ],
                },
              },
            },
            // 集成iview所需
            // {
            //   loader: 'iview-loader',
            //   options: {
            //     prefix: false,
            //   },
            // },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        // vue单文件使用
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
        chunkFilename: `css/${this.prod ? `[name].[contenthash].chunk.min.css` : `[name].chunk.css`}`,
        filename: `css/${this.prod ? `[name].[contenthash].min.css` : `[name].css`}`,
      }),
    ].concat([
      new WebpackHtmlPlugin({
        template: resolve('src/html/index.pug'),
        filename: 'index.html',
        chunks: ['common'],
      }),
    ]
    ),
  };
}
