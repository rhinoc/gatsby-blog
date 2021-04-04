---
title: 打造你的第一个Electron应用
date: 2019-02-03
category: frontend
tags: ["electron"]

---

## Before that…

![](https://pic.rhinoc.top/15491917249894.jpg)

在上手之前，先简要介绍一下Electron。简要来说，Electron是一个允许你用开发网站的方式开发应用程序的框架。当你打开一个Electron构建的应用时，实际上是打开了一个浏览器，而这个浏览器只能加载指定的网页文件，这些网页文件负责呈现程序的UI。既然能「用Web写App」，那么Electron的最吸引人的优点也就一目了然了——跨平台性。

想要更深入地了解Electron，可以看看这篇文章：[Electron，从玩玩具的心态开始，到打造出一款越来越优秀的桌面客户端产品 —— 一份不是「Hello Word」的吊胃口的Quick Start](https://webfe.kujiale.com/electron-quick-start/)

## 目录结构及文件

使用`npm init`创建一个Electron应用文件夹。下面是一个最最最基本的Electron应用目录结构：

```
app-name/  
├── package.json  
├── main.js  
└── index.html  
```

* pacakge.json

```json
{
  "name": "app-name",
  "version": "0.1.0",
  "main": "main.js"
}
```

`main`字段指向的js文件即为应用启动时运行的脚本

* main.js

在`package.json`中指定了启动时运行的脚本`main.js`。

```js
const { app, BrowserWindow } = require('electron')

function createWindow () {   
  // 创建浏览器窗口
  win = new BrowserWindow({ width: 800, height: 600 })

  // 然后加载index.html
  win.loadFile('index.html')
}

app.on('ready', createWindow)
```

* index.html

在`main.js`中`win.loadFile('index.html')`使程序显示`index.html`的内容。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1> 
  </body>
</html>
```

## 启动应用

在文件夹下执行`npm start`  
![](https://pic.rhinoc.top/15491896157340.jpg-300)
