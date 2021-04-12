---
title: 「这样玩Hexo」修改主题自定义实现界面和功能的自定义
date: 2019-02-10
category: etc
tags: ["hexo","blog"]

---


## 前言

作为一个颜党，在换了许多Hexo的主题后，选择了现在使用的[fexo](https://github.com/forsigner/fexo)主题。但是相比于大多数博主使用的[NEXT](https://github.com/theme-next/hexo-theme-next)，fexo还是不够powerful，所以想要给博客加一些additional的功能，还需要自己修改主题文件。

以下内容均基于`fexo`主题，对于其他主题也能作为参考，酌情修改。

## 博文添加版权声明

### 效果图
![](https://pic.rhinoc.top/15497710761152.jpg)

### layout
这里需要新建一个`.ejs`文件。我将它命名为`copyright.ejs`并放置在`fexo/layout/_partial/`下，文件内容为：

```html
<div class="post-copyright">
    <p class="post-copyright-author">
        <b>本文作者：</b>
        <a href="<%= config.root %>index.html" target="_blank" title="<%= config.author %>">
        <%= config.author %>
        </a>
    </p>
    <p class="post-copyright-link">
        <b>本文链接：</b>
        <a href="<%- config.root %><%- post.path %>" target="_blank" title="<%= post.title %>">
        <%- config.url %>/<%- post.path %></a>
    </p>
    <p class="post-copyright-license">
        <b>版权声明：</b>
        本博客所有文章除特别声明外，均采用
        <i class="fa fa-fw fa-creative-commons"></i>
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">BY-NC-SA 4.0</a>
        国际许可协议，转载请注明。</p>
</div>
```

然后在`article.ejs`中引入，找到`<%- post.content %>`，在下面添加：  

```html
<%- partial('copyright') %>  
```

这时候的版权声明还是没有样式的。

### CSS

想要实现上面图片的效果，还需要在CSS中给版权说明加上样式：  

```css
.post-copyright {
    margin: 2em 0 0;
    padding: 0.5em 1em;
    border-left: 3px solid #1bbc9b;
    background-color: #F7F7F7;
    list-style: none
}

.post-copyright p{
	line-height: 1em;
}
```

## 更改Gitalk样式

fexo已经原生支持了Gitalk，但是只是简单地开启了这个评论功能，显示效果还是Gitalk的默认效果，这样评论区就显得格格不入。

### 效果图

![](https://pic.rhinoc.top/15497717354181.jpg)

### CSS

Gitalk的样式是在线获取的，所以在CSS中需要加上`!important`才能覆盖原有样式。

主要做了如下修改：

* 修改评论框圆角为6px，与fexo主题中代码块样式统一
* 去除评论框边框，颜色修改，与主题中搜索框样式统一
* 修改显示字体

```css
.gt-container .gt-header-textarea , .gt-header-preview {
    border-radius: 6px!important;
    border: 0px!important;
    background-color: #f0f0f0!important;
    font-family: 'Open Sans Condensed',"Microsoft Yahei"!important;
}

.markdown-body p, .markdown-body blockquote, .markdown-body ul, .markdown-body ol, .markdown-body dl, .markdown-body table, .markdown-body pre , .gt-container .gt-counts{
    font-family: 'IBM 3270','Open Sans Condensed',"Microsoft Yahei"!important;
}

.gt-container .gt-ico-github svg {
    fill: #757575!important;
}
```

## 给博文中元素前加上Iconfont

### 效果图

![](https://pic.rhinoc.top/15497729082670.jpg)

### layout

这里需要引入FontAwesome的CSS文件，修改`head.ejs`，在``下另起一行，写入：  

```html
<link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"> 
```

### CSS

```css
.article-content p a:before {
    font-family: 'FontAwesome';
    content: '\f0c1';
    font-size: 0.7em;
	padding-left: 0.2em;
}  
```