---
title: Electron流程设计：从「代码」到「安装包」
date: 2019-02-03
category: frontend
tags: ["electron"]

---

## 前言

> 本文参考了@摘星的[用 Electron 打造 Win/Mac 应用，从「代码」到可下载的「安装包」，可能比你想得麻烦一点](https://webfe.kujiale.com/build-electron-app-gulp-workflow/)，摘星在他的文章中构建了一种通过`gulp`实现的自动化打包环节，为了避免重复造轮子，在下文中我只以macOS平台为例，大致过一遍各个环节的非自动化实现。

在[上一篇文章](https://rhinoc.top/post/electron_1)中，我们做了一个简单的「Hello, World!」应用，但是要启动这个应用，还需要`npm start`，更别提要执行这个命令前要输入的那么多安装指令了。

一句话，一个成熟的应用一定得有个安装包。

## 整体流程概览

摘星提出的开发Electron应用完整流程是：配置->[打包](https://electronjs.org/docs/tutorial/application-packaging)->[签名](https://electronjs.org/docs/tutorial/code-signing)->构建->发行。

然而我觉得，摘星将每个过程归纳为两个字是不够准确的。正如摘星将这一整套流程称为「Electron跨Win/Mac工程构建流程设计」，而在这整个「构建流程」中，居然也有一个环节叫做「构建」，这不免令人困惑。所以，我倒是更建议不去看环节的名称，而是看环节的目的，理解会更加准确一点。

基于这个原因，我将这五个环节更名为：
```  
初始化 -> 打包为APP -> 签名 -> 生成安装包 -> 发行
```

![](https://pic.rhinoc.top/15491935550650.jpg)

## 打包为APP

打包需要用到`electron-packager`，浏览[https://www.npmjs.com/package/electron-packager](https://www.npmjs.com/package/electron-packager)查看具体用法。

参考文档：  

```bash
electron-packager   --platform= --arch= [optional flags...]  
```

所以在这里，打包命令为：  

```bash
electron-packager . helloworld --mac --out ../dist --arch=x64 --electron-version=4.0.3  
```

由于Electron内置了Node.js、Chromium，所以即便只是个简单的「Hello, World!」程序，打包出来的应用也都能上百兆。

有关程序体积的精简，可以参考：[Electron 打包优化 - 从 393MB 到 161MB](https://imweb.io/topic/5b9f500cc2ec8e6772f34d79)

## 签名

在以（对小白）封闭著称的macOS中，未签名的应用程序不能被打开，除非在系统偏好设置中开启未知来源。  
![](https://pic.rhinoc.top/15491945674422.jpg)

要给macOS应用签名，需要：

1.  加入[Apple Developer Program](https://developer.apple.com/programs/)（需缴纳RMB688年费）
2.  在Xcode中申请证书  
    有关证书的选择可以参考[Mac App 发布的最后 1km](https://sspai.com/post/40269)
3.  使用`electron-osx-sign`签名  
    详细过程参考[electron-osx-sign guide](https://mintkit.net/electron-userland/electron-osx-sign/guide/)

要检查签名信息，在终端中运行：  

```bash
codesign --display --verbose=4 "path"  
```

## 生成安装包

### dmg

生成`.dmg`格式的安装包需要使用`appdmg`

Usage：  

```bash
appdmg <json-path> <dmg-path>  
```

这里需要输入一个`.json`文件，直接在`package.json`里添加参数会报错`data has additional properties`，于是我新建了一个`dmg.json`。Json文件的格式如下：

```json
{
  "title": "Test Application",
  "icon": "test-app.icns",
  "background": "test-background.png",
  "contents": [
    { "x": 448, "y": 344, "type": "link", "path": "/Applications" },
    { "x": 192, "y": 344, "type": "file", "path": "TestApp.app" }
  ]
}
```

这里的`path`填入在上一步打包得到的`.app`路径。

![](https://pic.rhinoc.top/15492065677360.jpg-500)  
![](https://pic.rhinoc.top/15492066040296.jpg-500)

更多说明请参考：[https://github.com/LinusU/node-appdmg](https://github.com/LinusU/node-appdmg)

### pkg

生成`.pkg`格式的安装包需要使用[`quickpkg`](https://github.com/scriptingosx/quickpkg)

就如同`quickpkg`的名字，生成安装包的命令也很简单：  

```bash
quickpkg helloworld.app  
```

![](https://pic.rhinoc.top/15492076707441.jpg)
