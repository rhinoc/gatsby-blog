---
title: 用户和用户组管理
date: 2019-01-14
category: cs
tags: ["linux"]

---

> *   对服务器安全要求高的服务器需要建立合理的用户权限等级制度和服务器操作规范
> *   在Linux中主要通过用户配置文件来查看和修改用户信息

## 用户配置文件

### 用户信息文件 /etc/passwd

![](https://pic.rhinoc.top/15474573221542.jpg)

*   第一字段：用户名称
*   第二字段：密码标示（真实密码在`/etc/shadow`中，经过512位SHA加密）
*   第三字段：UID
    *   0 超级用户
    *   1-499 系统用户（伪用户）
    *   500-65535 普通用户

[[danger]]
|修改UID可以实现用户的权限变更。

*   第四字段：GID（用户初始组ID）

> **初始组**：指用户一登陆就拥有这个用户组的相关权限，每个用户的初始组只能有一个，一般就是和这个用户的用户名相同的组名作为这个用户的初始组。初始组可以变更。  
> **附加组**：指用户可以加入多个其他的用户组并拥有相应权限。

*   第五字段：用户说明，可留空
*   第六字段：家目录
    *   普通用户：`/home/用户名/`
    *   超级用户：`/root/`
*   第七字段：登陆之后的Shell

> Shell就是Linux的命令解释器  
> 在`/etc/passwd/`当中，除了标准Shell是`/bin/bash`之外，还可以是`/sbin/nologin`（相当于禁用用户）

### 影子文件-etc-shadow

![](https://pic.rhinoc.top/15474584692540.jpg)

*   第一字段：用户名称
*   第二字段：经过SHA512加密后的密码
    *   `!!`或`*`代表没有密码，不支持登陆
    *   若在密码前加`!`，可以实现禁用密码
*   第三字段：密码最后修改时间
    *   以1970年1月1日作为标准时间，每过一天时间戳自增1
*   第四字段：两次密码修改间隔
*   第五字段：密码有效期
*   第六字段：密码到期前警告天数
*   第七字段：密码过期后的宽限天数
    *   `0` 密码过期后立即失效
    *   `-1` 密码永远不会失效
*   第八字段：账号失效时间（时间戳表示）

> 时间戳换算  
> 时间戳->标准日期 `date -d "1970-01-01 17897 days"`  
> 标准日期->时间戳 `echo $(($(date --date="2019/01/01" +%s)/86400+1))`

*   第九字段：保留字段

### 组信息文件 /etc/group

![](https://pic.rhinoc.top/15474596136220.jpg)

*   第一字段：组名
*   第二字段：组密码标志
*   第三字段：GID
*   第四字段：组中附加用户

### 组密码文件 /etc/gshadow

![](https://pic.rhinoc.top/15474597811937.jpg)

*   第一字段：组名
*   第二字段：组密码
*   第三字段：组管理员用户名
*   第四字段：组中附加用户

### 用户管理相关文件

1.  家目录
    *   普通用户：`/home/用户名`，所有者和所属组都是此用户，权限为700
    *   超级用户：`/root/`，所有者和所属组都是root用户，权限是550
2.  用户邮箱
    *   `/var/spool/mail/用户名/`
3.  用户模版目录
    *   `/etc/skel`

## 用户管理命令

### useradd

选项：

*   `-u` UID
*   `-d` 家目录
*   `-c` 用户说明
*   `-g` 初始组名
*   `-G` 附加组名（多个组用`,`分开）
*   `-s` shell

```
# 查看useradd后进行了哪些操作  
grep sc /etc/passwd  
grep sc /etc/shadow  
grep sc /etc/group  
grep sc /etc/gshadow  
ll -d /home/lamp/  
ll /var/spool/mail/lamp  
```

#### 用户默认值配置文件
```
# /etc/default/useradd  

SHELL=/bin/sh #默认shell  
GROUP=100 #默认组  
HOME=/home #用户家目录  
INACTIVE=-1 #密码过期宽限天数  
EXPIRE= #密码失效时间  
SKEL=/etc/skel #模板目录  
CREATE_MAIL_SPOOL=yes #是否建立邮箱  
```

```
# /etc.login.defs   
PASS_MAX_DAYS 99999 #密码有效期  
PASS_MIN_DAYS 0 #密码修改时间  
PASS_MIN_LEN 5 #密码最小位数  
PASS_WARN_AGE 7 #密码到期警告  
UID_MIN 500 #UID范围  
GID_MAX 60000 #GID范围  
ENCRYPT_METHOD SHA512 #加密模式
```

### passwd

普通用户：`passwd` 只能修改自己的密码，在其后不能跟用户名  
超级用户：`passwd 用户名` 可修改所有用户的密码  
选项：

*   `-S` 查询用户密码状态，仅限root
*   `-l` 暂时锁定用户，仅限root
*   `-u` 解锁用户，仅限root
*   `--stdin` 可以通过管道符输出的数据作为用户的密码

```
root@server.com:~# passwd -S root  
root P 01/12/2019 0 99999 7 -1  
#用户名 密码设定日期 密码修改间隔 密码有效期 警告时间 密码过期宽限天数  
```

### usermod

选项：

*   `-u` 修改UID
*   `-c` 修改用户说明
*   `-G` 修改附加组
*   `-L` 临时锁定用户
*   `-U` 解除锁定

### chage

选项：

*   `-l` 列出用户的详细密码状态
*   `-d` 修改密码更改日期

> `chage -d 0 用户名`  
> 将密码修改日期归零，使用户一登陆就需要修改密码

*   `-m` 修改间隔
*   `-M` 密码有效期
*   `-W` 密码过期前警告天数
*   `-I` 密码过后宽限天数
*   `-E` 账号失效时间

### userdel

选项：

*   `-r` 删除用户同时删除用户家目录

手动删除：  
```
vi /etc/passwd  
vi /etc/shadow  
vi /etc/group  
vi /etc/gshadow  
rm -rf /var/spool/mail/user  
rm -rf /home/user  
```

### id

查看用户ID  
```
root@server.com:~# id root  
uid=0(root) gid=0(root) groups=0(root)  
```

### su

切换用户身份

选项：  
`-` 连用户的环境变量一起切换  
`-c` 仅执行一次，而不切换用户身份

> `su - root -c "useradd user3"`

## 用户组管理命令

### groupadd

选项：

*   `-g GID` 指定GID

### groupmod

选项：

*   `-g GID` 修改组ID
*   `-n 新组名` 修改组名

### groupdel

删除的组不允许作为初始组

### gpasswd

选项：

*   `-a` 添加用户
*   `-d` 删除用户

也可以直接修改`/etc/group`文件

