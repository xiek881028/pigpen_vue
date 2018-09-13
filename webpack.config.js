'use strict';
const path = require('path');
const cuid = require('cuid');

const pkg = require('./package.json');

const webpack = require('webpack');
const WebpackMiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const WebpackUglifyjsPlugin = require('uglifyjs-webpack-plugin');
const WebpackOptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackVueLoaderPlugin = require('vue-loader/lib/plugin');

class WebpackConfig {
	constructor(env, argv) {
		this.prod = argv.mode == 'production';
		this.min = this.prod ? '.min' : '';
		this.cuid = this.prod ? `.${cuid()}` : '';
		return this.init();
	}

	init() {
		return {
			entry: this.entry(),
			output: this.output(),
			module: this.module(),
			resolve: this.resolve(),
			externals: this.externals(),
			plugins: this.plugins(),
			optimization: this.optimization(),
		};
	}

	entry() {
		return {
			_common: path.resolve(__dirname, 'src/js/_common.js')
		};
	}

	output() {
		return {
			path: path.resolve(__dirname, 'dist/js'),
			filename: this.prod ? `[name]${this.cuid}.js` : `[name].js`,
			chunkFilename: this.prod ? `chunk[id]${this.cuid}.js` : 'chunk[id].js',
			publicPath: "js/",
		};
	}

	module() {
		return {
			rules: [
				{
					test: /\.pug$/,
          oneOf: [
            {
              loader: 'pug-loader',
              exclude: /\.vue.pug$/,
              options: {
                pretty: !this.prod,
              },
            },
            {
              loader: 'pug-plain-loader',
            },
          ],
				},
				{
					test: /\.scss$/,
					use: [
						WebpackMiniCssExtractPlugin.loader,
						// 'style-loader',
						'css-loader?sourceMap',
						//不需要CSS Sprite功能 解开下面注释 同时注释'postcss-loader?sourceMap'
						// {
						// 	loader: 'postcss-loader',
						// 	options: {
						// 		plugins: [
						// 			require('autoprefixer')(),
						// 		],
						// 		sourceMap: true,
						// 	},
						// },
						'postcss-loader?sourceMap',
						'sass-loader?sourceMap',
					],
				},
				{
					test: /\.js$/,
					use: ['babel-loader'],
					exclude: /node_modules/,
				},
				{
					test: /\.(gif|jpe?g|png)(\?.*)?$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 8192,
								name: '../images/[name].[ext]',
							},
						},
					],
				},
				{
					test: /\.(ttc|ttf|woff|eot|svg|woff2)(\?.*)?$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 8192,
								name: '../font/[name].[ext]',
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
										// 'vue-style-loader',
										'css-loader?sourceMap',
										'postcss-loader?sourceMap',
										'sass-loader?sourceMap',
									]
								},
							},
						},
					],
				},
			],
		};
	}

	resolve() {
		return {};
	}

	externals() {
		return {
      axios: 'axios',
			vue: 'Vue',
			vuex: 'Vuex',
			json3: 'JSON3',
		};
	}

	optimization() {
		return {
      minimizer: [
        new WebpackUglifyjsPlugin({
					parallel: 4,
        }),
        new WebpackOptimizeCSSAssetsPlugin({
          cssProcessorOptions: {discardComments: {removeAll: true}},
        }),
      ],
		};
	}

	plugins() {
		let plugins = [
			new webpack.optimize.OccurrenceOrderPlugin(),
			new WebpackVueLoaderPlugin(),
			new WebpackMiniCssExtractPlugin({
				chunkFilename: `../css/${this.prod ? `chunk[id].${this.cuid}.css` : `chunk[id].css`}`,
				filename: `../css/${this.prod ? `[name].${this.cuid}.css` : `[name].css`}`,
			}),
		];

		plugins.push(new WebpackHtmlPlugin({
			title: {
				min: this.min,
				cuid: this.cuid,
				author: pkg.author,
				keywords: pkg.keywords.join(', '),
				description: pkg.description,
			},
			template: path.resolve(__dirname, 'src/html/index.pug'),
			filename: path.resolve(__dirname, 'dist', 'index.html'),
			inject: false,
		}));

		return plugins;
	}
}

module.exports = (env, argv) => {
	return new WebpackConfig(env, argv);
};
