---
title: Python编程快速上手（六）人人影视资源搜索器
date: 2019-02-02
category: etc
tags: ["python"]

---

## 程序描述

输入关键字，在[人人影视](www.zimuzu.io)中搜索影视剧，回显搜索结果，输入编号得到ed2k链接🔗。  
![](https://pic.rhinoc.top/15490405569586.jpg?imageslim)  
由于人人影视采用等级制度，资源下载链接需要登录后才能查看，所以这里用`session`模拟登陆。这一块参考了Github上[tengbozhang/renren](https://github.com/tengbozhang/renren)这一项目。

## 涉及知识点

*   session
*   requests
*   bs4
*   RegEx

## 代码

```python
#! python3
# -*- coding: utf-8 -*-

import webbrowser, requests, sys, bs4, re

headers = {
        'Accept':'application/json, text/javascript, */*; q=0.01',
        'Origin':'https://www.zimuzu.tv',
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        }

if len(sys.argv) < 2:
    keywords = input()
    url = 'https://www.zimuzu.io/search?keyword='+ keywords +'&type=resource'
else:
    url = 'https://www.zimuzu.io/search?keyword='+' '.join(sys.argv[1:])+'&type=resource'

res = requests.get((url),headers = headers)
res.raise_for_status()
soup = bs4.BeautifulSoup(res.text,"html.parser")

#print search result and make a choice
linkElems = soup.select('.t a')
for piece in linkElems:
    snum = str(piece.get('href'))[10:]
    print('['+ snum +']', end='')
    rr = re.compile(r'"list_title">(.*?)<\/strong>')
    print(rr.findall(str(piece))[0])
cho = input()

#print download urls
dlUrl = 'https://www.zimuzu.io/resource/list/' + cho
username = ''
password = ''
loginurl = 'https://www.zimuzu.io/User/Login/ajaxLogin'
data = "account=" + username + "&password="+ password + "&remember=1"
session = requests.Session()
login = session.post(loginurl,data = data,headers = headers)
dlSoup = bs4.BeautifulSoup(session.get(dlUrl).content.decode('utf-8'),"html.parser")
dlElems = dlSoup.find_all('a', {"type" : "ed2k"})
for piece in dlElems:
    print(piece.get('href'))
```
