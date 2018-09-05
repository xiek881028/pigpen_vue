/*!
 * publicFn
 * xiekai <xk285985285@.qq.com>
 * create: 2017/11/30
 * since: 0.0.1
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');

module.exports = {
	// isArray
	// 数组判断
	isArray: function (it) {
		return Object.prototype.toString.call(it) === '[object Array]';
	},

	// fileTree
	// 循环指定目录，输出目录内所有文件列表的数组
	// file 文件名或文件夹名
	// loop 是否循环遍历所有子目录
	fileTree: function (file, loop = true) {
		let fileList = [];
		function walk(file) {
			//如果入参是文件，直接加入数组返回
			if(!fs.statSync(file).isDirectory()){
				fileList.push(file);
				return;
			}
			let dirlist = fs.readdirSync(file);
			dirlist.forEach(function (item) {
				let itemPath = path.resolve(file, item);
				if (fs.statSync(itemPath).isDirectory() && loop) {
					walk(itemPath);
				} else {
					fileList.push(itemPath);
				}
			});
		};
		walk(file);
		return fileList;
	},

	// 数组合并处理
	// mode 合并方式 diff：差集 sum：合集
	mathArr: function (arr1, arr2, mode = 'diff') {
		let set = new Set(arr2);
		let out = [];
		arr1.map(item => {
			if(mode == 'diff' && !set.has(item)){
				out.push(item);
			}
			if(mode == 'sum' && set.has(item)){
				out.push(item);
			}
		});
		return out;
	}
};
