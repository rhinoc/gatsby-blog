---
title: 「这样玩Hexo」一个命令优化并部署博客
date: 2019-02-10
category: etc
tags: ["hexo","blog"]

---


## 前言

> 每次写好了博文，都要手动部署到服务器，麻烦。所以我希望能在Alfred中输入一个命令就能实现部署。

每次部署需要这些步骤：  

```
   +-----------------+
   |                 |
   |  Open Terminal  |
   |                 |
   +--------+--------+
            |
            |
+-----------v-----------+
|                       |
|   cd documents/hexo   |
|   hexo clean          |
|   hexo g              |
|   hexo d              |
|                       |
+-----------------------+
```

那么只需要复现上述命令，就能实现自动部署了。

## 写一个-command

Windows里有`.bat`批处理，macOS里有`.command`。

新建一个`hexo.command`文件，文件内容如下：  

```bash
cd documents/hexo  
hexo clean  
hexo g  
hexo d  
```

## 配置一个Alfred Workflow

在Alfred中以Keywords模版新建一个Workflow。  
![](https://pic.rhinoc.top/15497690596669.jpg)

设置输入`hexo`时启动之前保存的`hexo.command`。

![](https://pic.rhinoc.top/15497699954093.jpg)

启用这个Workflow就OK了。

![](https://pic.rhinoc.top/15497698534260.jpg)  
![](https://pic.rhinoc.top/15497700083064.jpg)