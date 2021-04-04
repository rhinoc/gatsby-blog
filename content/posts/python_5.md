---
title: Python编程快速上手（五）百度搜索+
date: 2019-01-31
category: etc
tags: ["python"]

---

## 程序描述

输入关键字，打开百度搜索前五个搜索结果，当无关键字输入时，搜索剪贴板中内容

## 涉及知识点

*   HTTP headers
*   requests
*   webbrowser
*   bs4

## 几个要点

> 这个小程序对应书上`p202`页码的 「11.6 项目：”I’m Feeling Lucky” Google 查找」 ，不过我将其中的🔍搜索引擎从谷歌换成了百度。

### BeautifulSoup4-Warning

书中给的代码`soup = bs4.BeautifulSoup(res.text)`会引发下面👇的警告。

> UserWarning: No parser was explicitly specified, so I’m using the best available HTML parser for this system (“html5lib”). This usually isn’t a problem, but if you run this code on another system, or in a different virtual environment, it may use a different parser and behave differently.
> 
> To get rid of this warning, change this:
> 
> BeautifulSoup([your markup])
> 
> to this:
> 
> BeautifulSoup([your markup], “html.parser”)
> 
> markup_type=markup_type))

根据提示，修改此行代码为：  
`soup = bs4.BeautifulSoup(res.text,"html.parser")`

### 伪造请求头

本部分参考了[Python利用requests和re模块爬取百度图片](https://blog.csdn.net/lylfv/article/details/81570307)

直接照搬源代码之后发现无论如何修改Select，`linkElems`中都没有元素。在网上查了一下，才发现是百度屏蔽了Python的请求，所以需要伪造一个请求头才能得到正确的响应。

以Firefox为例，`F12`打开Toggle Tools，切换到`Network`选项卡，点击`XHR`子选项，刷新页面后得到请求项，单击就能看到请求头。  
![](https://pic.rhinoc.top/15489382993709.jpg)

## 代码

```python
#! python3

import webbrowser, requests, sys, bs4, pyperclip

if len(sys.argv) < 2:
    url = 'http://www.baidu.com/s?ie=utf-8&wd='+' '.join(pyperclip.paste())
else:
    url = 'http://www.baidu.com/s?ie=utf-8&wd='+' '.join(sys.argv[1:])

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0', 'Referer':'http://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&word=%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0',}

res = requests.get((url),headers = headers)
res.raise_for_status()

soup = bs4.BeautifulSoup(res.text,"html.parser")
linkElems = soup.select('h3 a')
numOpen = min(5, len(linkElems))

for i in range(numOpen):
    webbrowser.open(linkElems[i].get('href'))
```