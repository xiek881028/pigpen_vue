/*!
 * publicFn
 * xiekai <xk285985285@.qq.com>
 * create: 2017/11/30
 * since: 0.0.1
 */
'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
	//isArray
	//数组判断
	isArray : function(it){
		return Object.prototype.toString.call(it) === '[object Array]';
	},

	//fileTree
	//循环指定目录，输出目录内所有文件列表的数组
	fileTree : function(file){
		let	fileList	=	[];
		function walk(file){
			let dirlist		=	fs.readdirSync(file);
			dirlist.forEach(function(item){
				if(fs.statSync(file + path.sep + item).isDirectory()){
					walk(file + path.sep + item);
				}else{
					fileList.push(path.resolve(file + path.sep + item));
				}
			});
		};
		walk(file);
		return fileList;
	},
};
