---
title: 阿里云服务器部署Hexo搭建个人博客
date: 2018-09-01
category: etc
tags: ["hexo","blog"]

---

> 闲置一年的域名快要到期了，又不想这么拱手让人，索性再续费建个个人博客。

基本框架是这样的：

![](https://ws1.sinaimg.cn/large/00706IQxgy1fuvd198ghjj31220ohtch.jpg)

### 本机端环境部署

#### 安装Hexo

> Hexo作为博客框架。

*   安装Xcode
*   安装Node.js
*   安装Git
*   安装Hexo

详细步骤参见[官方文档](https://hexo.io/zh-cn/docs/)。

#### 生成SSH公钥

> SSH公钥用于之后实现免密登陆服务器

```bash
# 产生公钥与私钥对  
ssh-keygen  
  
# 将公钥上传到服务器 user为服务器端的用户名，ip_address为服务器ip地址  
ssh-copy-id user@ip_address  
```

生成的公钥也可以通过阿里云控制台上传到服务器

### 服务器端环境部署

#### 端口放行

在阿里云控制台中放行端口号。

#### 安装Node-js-Git和Nginx

```bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -

$ apt-get install -y nodejs

yum install nginx

apt -get install git
```

#### 新建网站根目录

```bash
cd /  
mkdir var/www/hexo
```

#### 新建Git仓库

```bash
cd /home/
sudo git init --bare hexo.git
chown -R git:git hexo.git
```

#### 配置Hooks

```bash
cd /var/www/hexo/blog.git/hooks  
#默认可能有这个文件，没有就新建一个  
vim post-receive  
```

写入如下内容：

```bash
#!/bin/bash  
rm -rf /var/www/hexo #清空网站目录  
git clone /home/hexo.git /var/www/hexo #将Git仓库克隆进网站文件夹  
```

然后赋予`post-receive`执行的权限

```bash
chmod +x post-receive  
```

#### 配置Nginx

```bash
vim /etc/nginx/con.f/hexo.conf #在Nginx配置目录下新建配置文件并编辑它  
```

写入如下内容：

```
server{  
 listen 8080;  
 root /var/www/hexo;  
}  
```

`listen 8080`表示监听8080端口，注意这个端口要是前面已经放行的端口。  
`root /var/www/hexo`设置8080端口返回的根目录。

配置完成后需要重启Nginx使设置生效。

```
service nginx restart  
```

### 本机端Hexo配置

#### 新建文件夹作为博客本地存放路径

```bash
mkdir ~/documents/hexo  
cd  ~/documents/hexo  
hexo init #将文件夹初始化为Hexo目录结构  
```

#### 配置deploy

打开上面初始化后的文件夹，打开其中的`_config.yml`文件，填写`deploy`字段的信息。

```
deploy:  
 type: git  
 repo: user@IP:/home/hexo.git  
```

其中，`user`为服务器端用户名，`IP`为服务器地址

#### 安装Hexo发布插件

```bash
npm install hexo-deployer-git --save  
```

### 将本地博客文件部署入服务器

```bash
cd ~/documents/hexo  
hexo g #利用本地博客目录下的Markdown生成HTML文件  
hexo d #将生成的网页部署入服务器  
```

这时候在域名后加上端口号，在浏览器中打开，就能看到Hexo默认配置的网页了。
