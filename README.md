# pigpen(vue)

pigpen(vue)是一个轻量级前端单页应用架构。

您现在看到的为pigpen的vue版本，浏览器支持情况以vue为准。

详情文档请移步[pigpen](https://github.com/xiek881028/pigpen)查看。本文档只简单介绍差异部分。

## 差异说明

由于pigpen(vue版)被设计为单页应用框架，所以整个项目针对单页应用做了优化。如果无需单页应用，请根据pigpen的jquery版配置进行部分调整。

- webpack配置针对单页应用做了简化，删除单页应用不需要的冗余代码，只支持单页面编译。
- 自定义shell调整为不再生成css和html文件，js文件生成位置改为src/js/pages下，后缀名改为.vue。
- package.json删除了jquery相关包，引入了vue相关包。
- layout.pug整合入index.pug，index作为项目基础页面。

## 快速开始

同pigpen(jquery)版。

```sh
# 下载依赖组件
# (使用了淘宝镜像)
cnpm i
#或者不使用淘宝镜像
npm i

# 框架初始化
npm run init

# 页面编译
npm start
```

现在，项目根目录的dist目录下会生成index.html文件，用浏览器查看你的“hello world”吧。

## 常用命令

项目shell命令分为两部分。npm命令定义在package.json中，自定义shell命令定义在shell.js中。您可以根据实际项目需求自行添加删改。

```sh
# 项目开发(生成未压缩js、css文件，方便开发调试。命令挂载，终止命令后将停止编译)
npm start

# 项目发布(生成js、css的min文件，用于线上生产环境)
npm release

# 添加页面模块(同步生成pug、scss、js文件，自动添加头部注释，自动引入相关依赖)
npm run shell -- --add --name <页面名称>

# 删除页面模块(同步删除pug、scss、js文件)
npm run shell -- --del --name <页面名称>
```

## 许可证（License）

GPL
