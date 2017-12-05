'use strict';
const argv = require('yargs').argv;
const path = require('path');

const pkg = require('./package.json');

const webpack = require('webpack');
const webpackBabelPlugin = require('babel-webpack-plugin');
const webpackEs3ifyPlugin = require('es3ify-webpack-plugin-v2');
const webpackExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackHtmlPlugin = require('html-webpack-plugin');

class WebpackConfig {
	constructor() {
		this.prod = argv.optimizeMinimize;
		this.min = this.prod ? '.min' : '';
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
			filename: `[name]${this.min}.js`,
		};
	}

	module() {
		return {
			rules: [
				{
					test: /\.pug$/,
					use: ['pug-loader'],
				},
				{
					test: /\.scss$/,
					use: webpackExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
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
					}),
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
					test: /\.(ttc|ttf|woff)(\?.*)?$/,
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
									scss: webpackExtractTextPlugin.extract({
										// fallback: 'vue-style-loader',
										use: [
											'css-loader?sourceMap',
											'postcss-loader?sourceMap',
											'sass-loader?sourceMap',
										],
									}),
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
			vue: 'Vue',
			vuex: 'Vuex',
			json3: 'JSON3',
		};
	}

	plugins() {
		let plugins = [
			new webpack.DefinePlugin({'process.env': {NODE_ENV: `'${this.env}'`}}),
			new webpackExtractTextPlugin(path.join('../css', `[name]${this.min}.css`)),
			new webpackBabelPlugin(),
			new webpackEs3ifyPlugin(),
		];

		if(this.prod) {
			plugins.push(new webpack.optimize.CommonsChunkPlugin({name: '_common', minChunks: 2}));
			plugins.push(new webpack.optimize.UglifyJsPlugin({
				comments: false,
				compress: {
					properties: false,
					warnings: false,
				},
				sourceMap: true,
			}));
		}

		plugins.push(new webpackHtmlPlugin({
			title: {
				min: this.min,
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

module.exports = () => {
	return new WebpackConfig();
};
