---
title: 两分钟写个NodeJS，让Chrome根据输入语言切换搜索引擎
date: 2020-03-02
category: frontend
tags: ["nodejs"]
---

我们总说，Google 是最好的搜索引擎，百度是最好的中文搜索引擎。但是默认搜索引擎只有一个，怎么能让我在输入中文时使用百度，其他语言的时候切换到 Google 呢。

思路很简单，用 NodeJS 写个服务器，这个服务器根据 GET 请求参数的语言将网页重定向到真正的搜索引擎。

按照模块化的编程思想，我们将文件结构设置成这样：

```
main/
├── index.js #主文件
├── router.js #路由模块
├── server.js #服务器模块
└── requestHandlers.js #请求处理模块
```

![几个文件之间的关系](https://pic.rhinoc.top/mweb/index-js.svg)

## 源代码

### index.js

在主文件里，将其他模块引入。最后`server.start`启动服务器。

```js:title=index.js
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/search"] = requestHandlers.search;

server.start(router.route, handle);
```

### server.js

server.js 中定义一个 HTTP 服务器，并设置好监听的端口号。

```js:title=server.js
var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        route(handle, pathname, response, request);
    }
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}
exports.start = start;
```

### router.js

在路由中，我们把请求转发给 RequestHandler，如果没有对应的 handler 就返回 404 错误。

```js:title=router.js
function route(handle, pathname, response, request) {
    console.log("About to route a request for" + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {
            "Content-Type": "text/html"
        });
        response.write("404 Not found");
        response.end();
    }
}

exports.route = route;
```

### requestHandler.js

最后就到真正和搜索转发有关的事件处理器了。

```js:title=requestHandler.js
var urldeal = require("url");

function search(response, request) {
    console.log("Request handle 'search' was called.");
    var params = urldeal.parse(request.url, true).query;
    var query = params.q;
    var baidu_search = "https://www.baidu.com/s?wd=";
    var google_search = "https://www.google.com/search?q=";
    var dest;
    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    if (reg.test(query)) {
        dest = baidu_search + urlencode(query);
    } else {
        dest = google_search + urlencode(query);
    }
    console.log(dest);
    response.writeHead(302, {
        Location: dest
    });
    response.end();
}
// URL 编码

function urlencode(str) {
    str = (str + "").toString();
    return encodeURIComponent(str).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
}
//导出
exports.search = search;
```

## 使用

在 Chrome 中修改默认搜索引擎为`http://127.0.0.1:8888/search?q=%s`即可。

的确，我们可以直接在根目录运行`node index.js`就能启动服务器，不过这样每次开机都要重复输入代码，还得忍受 Terminal 小黑窗一直开着。

一个好的搜索引擎转发应该让人感受不到它的存在，这也就是为什么我会处于延迟的考量选择将 node 部署在本机而不是云服务器上。那有没有办法能让这个 node 在开机自启且不留小黑窗呢？

答案当然是有的，我们先写一个`.sh`文件：

```shell
cd [the folder]
node index.js
```

然后使用[Lingon X](https://www.peterborgapps.com/lingon/)设置它开机启动。

## 还有一些想法

1. 监测网络环境是否能访问 Google，无法访问 Google 的情况下所有语言都使用百度。
2. 说实话面向浏览器当然还是用扩展更方便了，不过，我不会写 Chrome 扩展呀。

## 参考资料

[Node 入门 » 一本全面的 Node.js 教程](https://www.nodebeginner.org/index-zh-cn.html)
