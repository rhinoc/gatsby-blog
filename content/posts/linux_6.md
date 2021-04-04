---
title: 软件包管理
date: 2019-01-12
category: cs
tags: ["linux"]

---

## 简介

### 软件包分类

*   源码包：大多数都是C语言，安装时需要编译，耗时长
    *   脚本安装包：不需要手动安装
*   二进制包（RPM包、系统默认包）：源码包经过编译得到

#### 源码包

优点：

*   开源，可以修改
*   可以自由选择所需功能
*   编译安装，所以更适合本机系统，更加稳定效率更高
*   卸载方便，直接删除目录

缺点：

*   安装步骤较多
*   编译过程时间较长
*   一旦报错新手难以解决

#### RPM包

优点：

*   系统简单，只通过几个命令就能完成安装、升级和卸载
*   安装快速

缺点：

*   不能看到源代码
*   功能选择不如源码包灵活
*   依赖性

## RPM包管理

### 包命名

包全名：`httpd-2.2.15-15.el6.centos.1.i686.rpm`

*   `httpd` 软件包名
*   `2.2.15` 软件版本
*   `15` 软件发布的次数
*   `el6.centos` 适合Linux平台（不写表示全平台适配）
*   `i686` 适合硬件平台（noarch表示全硬件适配）
*   `rpm` RPM包扩展名

包全名：操作的包是未安装的软件包时，使用包全名，注意路径，通常用于安装和升级。  
包名：操作已经安装的软件包时，使用包名。搜索/var/lib/rpm/中的数据库

### 依赖性

*   树形依赖：a->b->c
*   环形依赖：a->b->c->a（用一条命令同时安装）
*   模块依赖：[模块依赖查询网站](www.rpmfind.net)
    *   库依赖包（含有`.so`）不是单独独立的包，而是在一个软件包中的文件，需要在模块依赖查询网站中查询其所属的包。

### 安装、升级与卸载

#### 安装命令

`rpm -ivh 包全名`  
选项：

*   `-i` install 安装
*   `-v` verbose 显示详细信息
*   `-h` hash 显示进度
*   `-nodeps` 不检测依赖性

#### 升级命令

`rpm -Uvh 包全名`  
选项：

*   `-U` upgrade 升级

#### 卸载命令

`rpm -e 包名`  
选项：

*   `-e` 卸载
*   `--nodeps` 不检查依赖性

### 查询

`rpm -q 包名`  
选项：

*   `-q` query 查询
*   `-a` all 查询所有
*   `-i` information 查询软件信息
*   `-p` package 查询未安装包信息
*   `-l` list 列表
*   `-f` file 查询系统文件属于哪个软件包
*   `R` requires 查询软件包的依赖性

### 校验

`rpm -V` verify 校验指定RPM包中的文件有哪些被修改，如果完全一致，则不做任何输出，只有发现有不正确的文件时才会输出。

*   `S` 文件大小改变
*   `M` 文件类型或权限改变
*   `5` MD5校验和改变
*   `D` 文件的主设备号和次设备号改变
*   `L` 路径改变
*   `U` 文件的所有者改变
*   `G` 文件所有组改变
*   `T` 文件修改时间改变

*   `c` 配置文件

*   `d` 普通文档
*   `g` 鬼文件（该文件不应该被这个RPM包包含）
*   `l` 授权文件
*   `r` 描述文件

### 文件提取

`rpm2cpio 包全名 |\ cpio -idv .文件绝对路径` 将RPM包转换为cpio格式

    * `cpio` 是一个用于从档案文件中提取文件和创建软件档案文件的标准工具

实例：  

```
rpm -qf /bin/ls  
# 查询ls命令属于哪个软件包  
mv /bin/ls /tmp/  
# 造成ls命令误删除假象  
rpm2cpio /mnt/cdrom/Packages/coreutils-8.4-19.el6.i686.rpm | cpio -idv ./bin/ls  
# 提取RPM包中ls命令到当前目录的/bin/ls下  
cp /root/bin.ls /bin/  
把ls命令复制到/bin/目录 完成修复  
```

### yum在线管理

#### IP地址配置

redhat系：使用setup工具  
设置网卡自启：  
`vi /etc/sysconfig/network-scrpts/ifcfg-eth0` 将ONBOOT设置为YES  
重启网络服务：  
`service network restart`

#### 网络yum源

`vi /etc/yum.repos.d/CentOS-Base.repo`

*   `[base]` 容器名称
*   `name` 容器说明，可以自己随便写
*   `mirrorlist` 镜像站点
*   `baseurl` yum源服务器地址，默认为官方
*   `enabled` 此容器是否生效
*   `gpgcheck` RPM数字证书是否生效
*   `gpgkey` 数字证书的公钥文件保存位置

#### yum命令

*   `yum list` 查询所有可用软件包列表
*   `yum search 关键字` 搜索服务器上所有和关键字相关的包
*   `yum -y install 包名` 安装
    *   `install` 安装
    *   `-y` 自动回答yes
*   `yum -y remove 包名` 卸载
*   `yum groupinstall 软件组名` 安装软件包组
*   `yum groupremove 软件组名` 卸载软件包组

#### 光盘yum源搭建

1.  挂载光盘 `mount /dev/cdrom /mnt/cdrom/`
2.  让网络yum源文件失效 `mv CentOS-Debuginfo.repo CentOS-Debuginfo.repo.bak`
3.  修改光盘yum源文件 `vim CentOS-Media.repo`

```
[c6-media]  
name=CentOS-$releasever - Media  
baseurl=file:///mnt/cdrom  
# 地址为光盘挂载地址  
gpgcheck = 1  
enabled = 1  
# 使生效  
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6  
```

注意：Linux中很多配置文件不支持注释和缩进

## 源码包管理

### 与RPM包区别：

RPM包安装在默认位置中

<div class="table-container">

<table>

<thead>

<tr>

<th>/etc/</th>

<th>配置文件安装目录</th>

</tr>

</thead>

<tbody>

<tr>

<td>/usr/bin/</td>

<td>可执行的命令安装目录</td>

</tr>

<tr>

<td>/usr/lib/</td>

<td>程序所使用的函数库保存位置</td>

</tr>

<tr>

<td>/usr/share/doc/</td>

<td>基本的软件使用手册保存位置</td>

</tr>

<tr>

<td>/usr/share/man/</td>

<td>帮助文件保存位置</td>

</tr>

</tbody>

</table>

</div>

源码包安装在指定位置中，一般是`/usr/local/软件名/`。

安装位置不同带来的影响：RPM包安装的服务可以使用系统服务管理命令（service）来管理，例如RPM包安装的apache的启动方法是：`/etc/rc.d/init.d/httpd`或`start service httpd start`。而源码包安装的服务不能被service搜索到，因为没有安装到默认路径中，只能用绝对路径进行服务管理。

### 安装过程

1.  安装C语言编译器
2.  下载源码包
3.  解压缩 `tar -zxvf 压缩包文件名`
4.  进入解压缩目录（INSTALL为安装说明，README为软件说明）
5.  软件配置和检查 `./configure`
    1.  定义需要的功能选项 `./configure --prefix=/usr/local/软件名`
    2.  监测系统环境是否符合安装要求
    3.  生成Makefile文件，用以后续使用
6.  编译 `make`
7.  若上述过程报错 `make clean`
8.  安装 `make install`

[[info]]  
| 源码保存位置：`/usr/local/src`  
| 软件安装位置：`/usr/local/`  

如何确定安装过程报错：
*   安装过程停止
*   出现error、warning或no的提示

源码包和RPM包可以共存。

### 卸载

`rm -rf 安装目录`

### 选择

对外访问：RPM包  
只供本机使用：源码包

## 脚本安装包

不是独立的软件包类型，常见安装的是源码包。是人为把安装过程写成了自动安装的脚本，只要执行脚本，定义简单的参数，就可以完成安装。

### 安装过程-1

1.  下载软件
2.  解压缩，进入解压缩目录
3.  `./setup.sh`
