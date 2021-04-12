---
title: 「Python」读取站点地图 自动为Gitalk创建Issues
date: 2019-02-09
category: etc
tags: ["python"]

---

## 前言

前些天给博客加了评论功能，试了Disqus、Valine等一干评论系统，最后还是选择了在大陆相对友好而且符合技术博客风格的Gitalk。但是由于Gitalk是利用Github里Repo的Issue实现评论功能，所以每篇博文都需要手动创建Issue，很是麻烦。于是就打算用Python写一个自动初始化的脚本。

## Gitalk的原理

知己知彼，百战不殆。写脚本之前，我们得先知道Gitalk是通过什么确定文章和Issue之间的关系的。通过查看[文档](https://github.com/gitalk/gitalk/blob/master/readme-cn.md)可以得到下面👇四个我们需要的参数。

<div class="table-container">

<table>

<thead>

<tr>

<th>参数</th>

<th>类型</th>

<th>说明</th>

<th>默认值</th>

</tr>

</thead>

<tbody>

<tr>

<td>`id`</td>

<td>String</td>

<td>页面的唯一标示，长度小于50</td>

<td>`location.href`</td>

</tr>

<tr>

<td>`labels`</td>

<td>Array</td>

<td>Issue的标签</td>

<td>`['Gitalk’]`</td>

</tr>

<tr>

<td>`title`</td>

<td>String</td>

<td>Issue的标题</td>

<td>`document.title`</td>

</tr>

<tr>

<td>`body`</td>

<td>String</td>

<td>Issue的内容</td>

<td>`location.href + header.meta[description]`</td>

</tr>

</tbody>

</table>

</div>

那么再看看Gitalk初始化时自动生成的Issue：  
![](https://pic.rhinoc.top/15497140095951.jpg)

在被这张图中，四个参数的值分别为：  

```
title: "渲染测试 | Dicerorhinus"  
labels: ['Gitalk','/post/themes-test.html']  
body: "https://rhinoc.top/post/themes-test.html"  
```

诶，`id`去哪了？  
其实，`labels`中的第二个元素`post/themes-test.html`就是`id`了。

现在我们对这四个参数有了更好地理解，可以开始写程序了。

## 流程图

```
  +-----------------------------+
  |                             |
  |       get urls from         |
  |        sitemap.xml          |
  |                             |
  +--------------+--------------+
                 |
                 |
                 |
  +--------------v--------------+
  |                             |
  |     login into Github       |
  |     get the repository      |
  |                             |
  +--------------+--------------+
                 |
                 |
                 |
+----------------v-----------------+
|                                  |
|   for every url in urls          |
|   create issue                   |
|   if its issue haven't created   |
|                                  |
+----------------------------------+
```

## 几个要点

### `id`须在50个字符以内

文档中已经指明了`id`和博文一对一的关系，并且在Gitalk自动生成的Issue中，`id`被设置为是博文所在的相对路径。由于`id`被限制在50个字符以内，所以当相对路径比较长时，就不适合作为`id`了，这时候可以使用MD5将相对路径编码：

```python
def md5(s):
    hash = hashlib.md5()
    hash.update(s.encode('utf8'))
    return hash.hexdigest()
```

由于我的博客中博文的相对路径在50个字符以内，所以并未采用MD5编码。

### 防止重复创建Issue

由于程序每次运行都要遍历一遍`sitemap.xml`，而一遍来说我们的博客中只有新写的博文没有创建Issue，如果不对「已初始化」和「未初始化」的链接加以区分，就会重复创建Issue。

所以，我们需要有一个数据库来储存哪些链接是已初始化过的，遍历`sitemap.xml`时，将其中的网址和数据库内容对比，对不在数据库中的网址进行初始化并写入数据库。

## 代码

```python
import bs4, requests
from github import Github
from urllib.parse import unquote

blogUrl = 'https://***.***.***'
sitemapUrl = 'https://***.***.***/sitemap.xml'
user = 'username'
token = ''
repoFullName = "user/repo"

session = requests.Session()
res = session.get(sitemapUrl)

readExistUrl = open('urls.txt','r')
writeExistUrl = open('urls.txt','a')
existList = readExistUrl.readlines()

# get urls from sitemap
def getSite(smUrl):
    html = requests.get(smUrl)
    soup = bs4.BeautifulSoup(html.text,"lxml")
    urls = soup.select('loc')
    urlset = []
    for url in urls:
        url = str(url)[5:-6]
        url = url.replace('http','https')
        urlset.append(url)
    return urlset

urls = getSite(sitemapUrl)
gh = Github(login_or_token = token)
repo = gh.get_repo(repoFullName)

for url in urls:
    if ((url + '\n') in existList) or (url in existList):
        continue
    title = url.rsplit('/',2)
    title = unquote(title[2])
    labels = ['Gitalk', url[18:]]
    repo.create_issue(title = title ,body = url,labels = labels)
    writeExistUrl.write('\n'+url)
    print(url + ' created')
    
readExistUrl.close()
writeExistUrl.close()
```
