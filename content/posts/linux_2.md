---
title: Linux系统安装
date: 2018-10-05
category: cs
tags: ["linux"]

---


## 虚拟机安装与使用

建议配置：  
* CPU主频1GHz以上  
* 内存1GB以上  
* 硬盘分区空闲空间8GB以上

## 系统分区

### 磁盘分区

使用分区编辑器把大硬盘分成几块小硬盘。

### 分区类型

对于一块硬盘：  
主分区：最多只能有4个  
扩展分区：

*   最多1个
*   主分区加扩展分区最多4个
*   不能写入数据，只能包含一个或多个逻辑分区  
    逻辑分区：可以写入数据和格式化

### 格式化

高级格式化、逻辑格式化，指根据用户选定的文件系统（如NTFS、FAT32）在磁盘特定区域写入特定数据、在分区中划出一片用于存放文件分配表、目录表等用于文件管理的磁盘空间。

### 硬件设备文件名

<div class="table-container">

<table>

<thead>

<tr>

<th>硬件</th>

<th>设备文件名</th>

</tr>

</thead>

<tbody>

<tr>

<td>IDE硬盘</td>

<td>/dev/hd[a-d]</td>

</tr>

<tr>

<td>SCSI/SATA/USB硬盘</td>

<td>/dev/sd[a-p]</td>

</tr>

<tr>

<td>光驱</td>

<td>/dev/cdrom /dev/sr0</td>

</tr>

<tr>

<td>软盘</td>

<td>/dev/fd[0-1]</td>

</tr>

<tr>

<td>打印机（25针式）</td>

<td>/dev/lp[0-2]</td>

</tr>

<tr>

<td>打印机（USB）</td>

<td>/dev/usb/lp[0-15]</td>

</tr>

<tr>

<td>鼠标</td>

<td>/dev/mouse</td>

</tr>

</tbody>

</table>

</div>

所有的硬件设备都是文件。

### 分区设备文件名

在末尾加上分区对应数字。  
`/dev/hda1` （IDE硬盘接口）  
`/dev/sda1` （SCSI硬盘接口、SATA硬盘接口）  
**IDE接口**：  
![](https://pic.rhinoc.top/15387324721349.png)

![](https://pic.rhinoc.top/15387328793525.jpg)

理论最高传输133MB/s

**SCSI接口**：  
主要用于服务器。  
![](https://pic.rhinoc.top/15387332683720.jpg)

理论最高传输320MB/s

**SATA接口**：  
目前主流。  
![](https://pic.rhinoc.top/15387335382180.jpg)
SATA3理论最高传输500MB/s

### 分区表示

注意：1-4只能用来表示主分区，5表示第一个逻辑分区。

### 挂载

盘符是Windows的说法，Linux叫挂载点。  
必须分区：

*   `/` （根目录）
*   SWAP分区（交换分区，内存的两倍，不超过2GB）

推荐分区：

*   `/boot` （启动分区，200MB）如果不分区的话所有启动文件都放在根目录下，当根目录写满，可能无法启动系统。

![](https://pic.rhinoc.top/15387341408046.gif)  
![](https://pic.rhinoc.top/15387342323822.png)

Linux系统里，子目录可以存在于与根目录不同的硬盘上。

## Linux系统安装

注意分区选择、时区、设定管理员密码。

## 远程登录管理工具

桥接：使用真实网卡，可以识别局域网内其他计算机，配置简单，占用ip  
NAT HostNet：使用虚假网卡，不能识别局域网内其他计算机，不占用ip

虚拟机设置网络为HostNet，分配和本机同一IP网段下的IP地址：  

```bash
ifconfig eth0 192.168.118.2  
```

如果本机插入了网卡，那么在虚拟机下设置网络为桥接，注意要桥接到有线网卡。

两个软件：

*   SecureCRT：在使用SecureCRT的时候，要将字体改为支持国标字符集的字体（比如「新宋体」），并且字符编码集要改为`UTF-8`。
*   Winscp：一种非常方便而且安全的文件拷贝工具。
