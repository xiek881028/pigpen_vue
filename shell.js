/*!
 * shell
 * xiekai <xk285985285@.qq.com>
 * create: 2017/11/30
 * since: 0.0.1
 */
'use strict';

const path = require('path');
const fs = require('fs');
const rmdir = require('rmdir');
const dateFormat = require('cainfoharbor-utils/dateFormat');
const publicFn = require('./publicFn.js');
const argv = require('yargs').argv;

const assets = {
	vue: {js: ['dist/vue.min.js', 'dist/vue.js']},
	'vue-router': {js: ['dist/vue-router.min.js', 'dist/vue-router.js']},
	// vuex: {js: 'dist/vuex.min.js'},
};

const today = dateFormat('yyyy-MM-dd', new Date());

if(argv.h){
	console.log(``);
	console.log(`查看帮助： npm run shell -- --h || node shell.js -h`);
	console.log(`开发环境初始化： npm run shell -- --init || node shell.js -init`);
	console.log(`添加页面模块： npm run shell -- --add --name <name> || node shell.js -add -name=<name>`);
	console.log(`删除页面模块： npm run shell -- --del --name <name> || node shell.js -del -name=<name>`);
	console.log(``);
}

if(argv.init){
	console.log(`开始导入 assets, 配置列表在shell.js顶部的assets变量`);
	const assetsPath = path.resolve(__dirname, 'dist/assets');
	if(!fs.existsSync(assetsPath)){
		addAssets();
	}else{
		rmdir(assetsPath, (err)=>{
			if(err) throw err;
			addAssets();
		});
	};

	function addAssets(){
		fs.mkdirSync(assetsPath);
		Object.keys(assets).map((item)=>{
			!fs.existsSync(path.resolve(assetsPath, item)) && fs.mkdirSync(path.resolve(assetsPath, item));
			if(publicFn.isArray(assets[item].js)){
				fs.mkdirSync(path.resolve(assetsPath, item, 'js'));
				assets[item].js.map((_item)=>{
					fs.copyFile(path.resolve(__dirname, 'node_modules', item, _item), path.resolve(assetsPath, item, 'js', path.parse(_item).base), (err)=>{
						if(err) throw err;
						console.log(`完成导入 ${_item}\n`);
					});
				});
			}else if(typeof(assets[item].js) == 'string'){
				fs.mkdirSync(path.resolve(assetsPath, item, 'js'));
				fs.copyFile(path.resolve(__dirname, 'node_modules', item, assets[item].js), path.resolve(assetsPath, item, 'js', path.parse(assets[item].js).base), (err)=>{
					if(err) throw err;
					console.log(`完成导入 ${assets[item].js}\n`);
				});
			};
			if(publicFn.isArray(assets[item].css)){
				fs.mkdirSync(path.resolve(assetsPath, item, 'css'));
				assets[item].css.map((_item)=>{
					fs.copyFile(path.resolve(__dirname, 'node_modules', item, _item), path.resolve(assetsPath, item, 'css', path.parse(_item).base), (err)=>{
						if(err) throw err;
						console.log(`完成导入 ${_item}\n`);
					});
				});
			}else if(typeof(assets[item].css) == 'string'){
				fs.mkdirSync(path.resolve(assetsPath, item, 'css'));
				fs.copyFile(path.resolve(__dirname, 'node_modules', item, assets[item].css), path.resolve(assetsPath, item, 'css', path.parse(assets[item].css).base), (err)=>{
					if(err) throw err;
					console.log(`完成导入 ${assets[item].css}\n`);
				});
			};
		});
	};
}

if(argv.add){
	if(!argv.name || !argv.name.length){
		console.error(`错误: 页面名称不能为空!`);
	}else{
		argv.name.split(',').map((name)=>{
			let same = 0;
			publicFn.fileTree(path.resolve(__dirname, 'src/html')).map((item)=>{
				if(name == path.parse(item).name)same = 1;
				return;
			});
			if(same){
				console.error(`错误: ${name} 页面已存在!`);
			}else{
				fs.writeFile(path.resolve(__dirname, 'src/js/components', `${name}.vue`),
					`/*!\n* ${name}\n* create: ${today}\n* since: 0.0.1\n*/\n\n<template lang="pug">\n</template>\n\n<script>\n</script>\n\n<style lang="scss" scoped>\n</style>\n`,
					(err)=>{
						if(err) throw err;
						console.log(`${name}.vue 创建成功 `);
					}
				);
			}
		});
	}
}

if(argv.del){
	if(!argv.name || !argv.name.length){
		console.error(`错误: 页面名称不能为空!`);
	}else{
		argv.name.split(',').map((name)=>{
			publicFn.fileTree(path.resolve(__dirname, 'src/js/components')).map((item)=>{
				if(name == path.parse(item).name){
					fs.unlink(item, (err)=>{
						if(err) throw err;
						console.log(`${path.parse(item).base} 删除成功`);
					});
					return;
				}
			});
		});
	}
}
