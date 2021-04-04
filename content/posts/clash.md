---
title: 可能是最适合macOS的网上冲浪之术
date: 2020-03-02
category: etc
tags: ["mac-flow"]

---

> 搞学术搞开发，怎么可能不接触点国外的东西呢？

还记得一年级微机课上，老师告诉我们两大搜索引擎——百度和谷歌，并对后者推崇备至。那时候的我想的却是，既然有百度干嘛要用谷歌，而且谷歌的名字还这么奇怪。直到长大了，曾经嗤之以鼻的谷歌却像是 ex 一样，成了一个只活在记忆里可念而不可及的存在。

除了讨厌着堵无形的墙给我带来的额外精力与金钱支出外，我还是理解并接受它的存在。毕竟它所要阻挡的和我所要探求的两个集合并不相交，所以我理解接受它，所以它也常网开一面。

言归正传，今天说说怎么在 macOS 平台下做网开一面中的漏网之鱼。

## Basic

几个歪理公式，方便理解：

> 科学上网 = 节点+代理软件
> 订阅链接 = $\displaystyle\sum_{i=1}^n节点$

当下主流机场提供的节点无外乎以下四种协议：

1. SS 协议
2. SSR 协议（兼容 SS）
3. SSR 协议
4. VMess 协议

而 macOS 下比较知名的代理软件有：

| 软件名称                                              |   支持协议   |
| :---------------------------------------------------- | :----------: |
| Surge                                                 |      SS      |
| Shadowsocks-NG                                        |      SS      |
| Shadowsocks-NG-R8                                     |    SS/SSR    |
| ClashX                                                |   SS/Vmess   |
| [ClashXR](https://github.com/WhoJave/clashX/releases) | SS/SSR/Vmess |

如果只考虑协议的支持情况，其实就已经高下立判了。不过目前 ClashXR 的知名度还不是很高，我也是乱翻 Github 才知道不仅有人用 Clash 核做了 GUI 版本的 ClashX，还有人 fork 了 ClashX 换上了另一个人 fork Clash 做的 ClashR 的核。画图来表示一下关系，其中 Clash 和 ClashR 都是内核，而 ClashX 和 ClashXR 是 GUI 应用：
![@2x](https://pic.rhinoc.top/mweb/15830741698612.jpg)

除了知名度不高以外，ClashXR 还有一些不只是有意还是无意的 bug，比如在关于页面显示的连接还是 Clash 和 ClashX 的，以及检查更新得到是 ClashX 的更新包。还硬要说有什么缺点的话，就是更新慢了。

![@2x](https://pic.rhinoc.top/mweb/15830745239304.jpg)

缺点说完了，剩下的就都是优点了。由于站在巨人 ClashX 的肩膀上，ClashXR 有着易用且好看的 UI，由于站在另一个巨人 ClashR 的肩膀上，ClashXR 有着丰富全面的协议兼容性。

瑕不掩瑜，ClashXR 这块金子终于还是会发光的，除了 Star 和 Fork 以肉眼可见地增长，越来越多的机场也开始提供 ClashXR 订阅支持。对于还不支持 ClashXR 订阅的机场，可以使用[v2ray2clash](https://github.com/ne1llee/v2ray2clash)分别将 v2ray 和 ssr 订阅链接转换一下，虽然有些麻烦，但还是能用的。

## Advanced

有了 ClashXR 这个万金油，就已经解决了 80%的上网需求。剩下的 20%，就要靠另外的一些玩意来补充了。

由于 ClashXR 只提供 Socks5 和 HTTP 代理，一般情况下浏览器需配合 ProxyOmega 这类的扩展，terminal 使用需要输入 shell command，对于其他不支持应用内设置代理的应用就爱莫能助了（比如内置的 Mail 无法收发 Gmail）。这时候就需要 Proxifier 做这么一个中间人，形成`本机->Proxifier->ClashXR->代理服务器->目标服务器`过程，实现真正的分应用代理/全局代理。

下载安装 Proxifier 后，在设置中可以设置规则，保持 Proxifier 开启状态就行了。

![@2x](https://pic.rhinoc.top/mweb/15830760144511.jpg)

需要注意的是，`本机`中也包括了 ClashXR 的出流量，为了不形成`ClashXR<->Proxifier`的死循环，需要在 Rules 里添加 ClashXR 直连，不过这个一般 Proxifier 默认会生成，无需用户操心。

可以看到在上图中，我设置了 Setapp, Dash 走代理，localhost 和系统进程直连，默认直连的规则。还可以设置`git`,`docker`等平时 terminal 要挂一天的，就不赘述了。

Proxifier 虽然好用，我们只需要配置一次基本就高枕无忧了，但它就喜欢赖在 Dock 栏上占着茅坑。针对这个问题，可以修改 Proxifier 的 Package Contents，在 Info.plist 中加入一对键值：

```
<key>LSUIElement</key>
<string>1</string>
```

再重新对 Proxifier 进行签名，否则重启后 Proxifier 会因为签名不一致而闪退：

```
sudo codesign -fs - /Applications/Proxifier.app
```

### Premium

至于更高阶的用法，比如 ACL 和 PAC 以及软件规则的编写，大家可以自行在 Github 上探索。

## 参考

[关于中国的互联网](https://github.com/ACL4SSR/ACL4SSR/wiki/%E5%85%B3%E4%BA%8E%E4%B8%AD%E5%9B%BD%E7%9A%84%E4%BA%92%E8%81%94%E7%BD%91)
