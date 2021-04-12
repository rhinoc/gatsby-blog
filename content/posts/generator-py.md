---
title: 「JSON-to-HTML」根据JSON文件信息生成静态导航网页
date: 2019-02-08
category: etc
tags: ["python"]

---

> 之前在 Gayhub 上 fork 了一个静态响应式导航[WebStack.cc](https://github.com/WebStackPage/WebStackPage.github.io)做了一个自己的网址导航「[造作家](https://index.rhinoc.top)」，具体的改造过程和未来的 Todo List 也许以后会单独写一篇博文。这篇博文只讲讲我是怎么用 Python 实现 HTML 的自动生成的。

## 分析 HTML 文件

因为是导航网站，所以网页内容除了外部的框架就是大面积的相同元素的重复。可以看看在 Atom 编辑器里面`index.html`的样子，右侧的 minimap 可以看出代码结构的大面积重复。  
![](https://pic.rhinoc.top/15496179113635.jpg)

有关`index.html`文件的结构如下：  
![](https://pic.rhinoc.top/15496206158776.jpg)  
其中有红色 flag🚩 的是每次在导航中增加条目时可能要修改的部分。那么思路就很明确了：Python 生成菜单部分（Part-A）和网站内容部分（Part-B），而不需要改变的内容分为`header`、`mid`、`footer`三部分保存在文档中，经由 Python 程序读取。最后程序将`header`-`Part-A`-`mid`-`Part-B`-`footer`拼接，生成最终的`index.html`。

## 确定 JSON 文件的结构

我设置了两个 JSON 文件，分别是`data.json`用来存储收录的网站条目，和`menu.json`用来存左侧菜单设置的组别。

### data.json

添加一个网站条目，需要包括它的分组类别、标题、描述、链接以及图标。  
![](https://pic.rhinoc.top/15496225628946.jpg)  
那么`data.json`文件的结构就可以设置为：

```json
"group": {
    "website": {
        "name": "",
        "url": "",
        "disc": "",
        "img": ""
    }
}
```

### menu.json

支持最多两级目录，其中一级目录需要设置 icon，二级目录仅以文字展示：  
![](https://pic.rhinoc.top/15496231285648.jpg)  
所以，设置`menu.json`为：

```json
"group": {
    "icon": "",
    "item": {
        "sub-group": "",
        "sub-group": ""
    }
}
```

## Python 程序实现

### 流程图

```
          +------------------+
          |                  |
          | read .json files |
          |                  |
          +--------+---------+
                   |
                   |
+------------------v-------------------+
|                                      |
|  read header.txt mid.txt footer.txt  |
|                                      |
+------------------+-------------------+
                   |
                   |
      +------------v------------+
      |                         |
      | generate website items  |
      |                         |
      +------------+------------+
                   |
                   |
                   |
        +----------v----------+
        |                     |
        |     generate menu   |
        |                     |
        +----------+----------+
                   |
                   |
                   |
        +----------v----------+
        |                     |
        | write to index.html |
        |                     |
        +---------------------+
```

### 代码

```python
#! python3
import os, json

# def header():

def genItem(url,img,name,disc):
    line = []
    line.append('\t<div class="col-sm-3">')
    line.append('\t\t<div class="xe-widget xe-conversations box2 label-info" onclick="window.open(\'' + url + '\', \'_blank\')" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + url +'">')
    line.append('\t\t\t<div class="xe-comment-entry">')
    line.append('\t\t\t\t<a class="xe-user-img">')
    line.append('''\t\t\t\t\t![](../assets/images/logos/''' + img + ''')''')
    line.append('\t\t\t\t</a>')
    line.append('\t\t\t\t<div class="xe-comment">')
    line.append('''\t\t\t\t\t<a href="#" class="xe-user-name overflowClip_1">''')
    line.append('\t\t\t\t\t\t<strong>' + name + '</strong>')
    line.append('\t\t\t\t\t</a>')
    line.append('''\t\t\t\t\t<p class="overflowClip_2">''' + disc + '</p>')
    line.append('\t\t\t\t</div>')
    line.append('\t\t\t</div>')
    line.append('\t\t</div>')
    line.append('\t</div>')
    html = ''
    for i in line:
        html += str(i) + '\n'
    return html

def genMenu(menu):
    line = []
    for title in menu:
        line.append('\t\t\t\t\t<li>')
        if 'item' in menu[title]:
            line.append('\t\t\t\t\t\t<a>')
        else:
            line.append('\t\t\t\t\t\t<a href="#' + title + '" class="smooth">')
        line.append('\t\t\t\t\t\t\t<i class="' + menu[title]['icon'] + '"></i>')
        line.append('\t\t\t\t\t\t\t<span class="title">' + title + '</span>')
        line.append('\t\t\t\t\t\t</a>')
        if 'item' in menu[title]:
            line.append('\t\t\t\t\t\t<ul>')
            for subtitle in menu[title]['item']:
                line.append('\t\t\t\t\t\t\t<li>')
                line.append('\t\t\t\t\t\t\t\t<a href="#' + subtitle + '" class="smooth">')
                line.append('\t\t\t\t\t\t\t\t\t<span class="title">' + subtitle + '</span>')
                line.append('\t\t\t\t\t\t\t\t</a>')
                line.append('\t\t\t\t\t\t\t</li>')
            line.append('\t\t\t\t\t\t</ul>')
        line.append('\t\t\t\t\t</li>')
    part = ''
    for i in line:
        part += str(i) + '\n'
    return part

def genMenua(menu):
    line = []
    for title in menu:
        line.append('\t\t\t\t\t<li>')
        if 'item' in menu[title]:
            line.append('\t\t\t\t\t\t<a>')
        else:
            line.append('\t\t\t\t\t\t<a href="index.html#' + title + '">')
        line.append('\t\t\t\t\t\t\t<i class="' + menu[title]['icon'] + '"></i>')
        line.append('\t\t\t\t\t\t\t<span class="title">' + title + '</span>')
        line.append('\t\t\t\t\t\t</a>')
        if 'item' in menu[title]:
            line.append('\t\t\t\t\t\t<ul>')
            for subtitle in menu[title]['item']:
                line.append('\t\t\t\t\t\t\t<li>')
                line.append('\t\t\t\t\t\t\t\t<a href="index.html#' + subtitle + '">')
                line.append('\t\t\t\t\t\t\t\t\t<span class="title">' + subtitle + '</span>')
                line.append('\t\t\t\t\t\t\t\t</a>')
                line.append('\t\t\t\t\t\t\t</li>')
            line.append('\t\t\t\t\t\t</ul>')
        line.append('\t\t\t\t\t</li>')
    part = ''
    for i in line:
        part += str(i) + '\n'
    return part

# load json file
dataJson = open('data.json', 'r', encoding='utf-8')
dataText = json.load(dataJson)
menuJson = open('menu.json', 'r', encoding='utf-8')
menuText = json.load(menuJson)

# load header, mid, footer
headerFile = open('header.txt','r')
header = headerFile.read()
midFile = open('mid.txt','r')
footerFile = open('footer.txt','r')
feeterFile = open('feeter.txt','r')

#
indexFile = open('../cn/index.html','w')
indexFile.write(header)
aboutFile = open('../cn/about.html','w')
aboutFile.write(header)


# generate Menu
indexFile.write('\t\t\t\t<ul id="main-menu" class="main-menu">\n')
aboutFile.write('\t\t\t\t<ul id="main-menu" class="main-menu">\n')
indexFile.write(genMenu(menuText))
aboutFile.write(genMenua(menuText))
aboutFile.write(feeterFile.read())

# add mid
indexFile.write(midFile.read())

# generate Item
for id in dataText:
    count = 0
    indexFile.write('<!-- ' + id + ' -->' + '\n')
    indexFile.write('<h4 class="text-gray"><i class="linecons-tag" style="margin-→: 7px;" id="' + id + '"></i>' + id + '</h4>\n')
    indexFile.write('<div class="row" id="content">\n')
    items = dataText[id]
    for item in items:
        temp = items[item]
        part = genItem(temp['url'],temp['img'],temp['name'],temp['disc'])
        indexFile.write(part)
        count += 1
        if count == 4:
            count = 0
            indexFile.write('</div>\n')
            indexFile.write('<div class="row" id="content">\n')
    indexFile.write('</div>\n</br>\n')
    indexFile.write('<!-- END ' + id + ' -->' + '\n')

# add footer
indexFile.write(footerFile.read())

# close files
indexFile.close()
aboutFile.close()
footerFile.close()
feeterFile.close()
headerFile.close()
midFile.close()
dataJson.close()
```
