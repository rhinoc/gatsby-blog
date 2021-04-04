---
title: macOS新手开发教程（一）准备工作
date: 2019-10-20
category: etc
tags: ["swift"]

---

## 发刊词

前几天在 macOS 的 App Store 上看到一个叫「小翻译」的应用。觉得挺简单的，监控剪贴板再随便调用一个在线翻译的 API 就行了。但是蓝色的图标放菜单太违和了，就想着自己能不能也做一个。然后呢，就有了[trans](https://github.com/rhinoc/trans)，在此之前，我丝毫没有接触过 macOS 的开发，trans 是我开发的第一个 macOS 应用。从有了想法到将 idea 落地，我深刻感受到 macOS 开发的门槛之高：

1. Apple 并没有专门为 macOS 写文档，而是将所有的开发文档都丢在[Apple Developer Documentation](https://developer.apple.com/documentation/)，这是因为 iOS、macOS、watchOS、tvOS 的开发具有高度相似性，对于有 iOS 开发经验的朋友更友好，但对于小白来说可能有点 overwhelming。
2. macOS 的用户数量少，无论是网络教程还是出版教程数量都极其有限，中文教程更是少之又少。
3. macOS 开发语言历经 Objective-C 到 Swift 的变化，UI 制作从手撸代码到 XIB 再到 storyboard 再到新推出的 SwiftUI。一种开发方式还来不及沉淀就因开发者切换新的开发方式而被弃用了。

因此，我想通过这系列博文，一方面记录我开发 trans 的过程，一方面为 macOS 补充一份适合新手的入门教程。虽然教程适用于没接触过 macOS 的小白，但是我希望你具备基础的编程知识和 macOS 使用技能，以及良好的搜索能力。

以下是我搜集到的 macOS 开发资料，我从中获益良多，也希望能帮助到你们：

1. [macOS Tutorials | raywenderlich.com](https://www.raywenderlich.com/macos)
2. [Apple Developer Documentation](https://developer.apple.com/documentation/)
3. [DeveloperLx/macOS_Development_Tutorials_translation: Translation of macOS development tutorials.](https://github.com/DeveloperLx/macOS_Development_Tutorials_translation)
4. [macOS 开发 - 知乎](https://zhuanlan.zhihu.com/c_1079349488673648640)
5. [Swift Dev Journal – Articles for iOS and Mac Developers](https://www.swiftdevjournal.com/)
6. [macOS 应用开发技术](https://macdev.io/)
7. [Documentation Archive](https://developer.apple.com/library/archive/navigation/)

## 准备工作

开发 macOS 的应用有两个门槛：

1. 一台运行 macOS 的机器。为了减少不必要的麻烦，我还是建议你使用 MacBook 或是 iMac，而不是黑苹果。
2. Xcode。这是 Apple 为 iOS 和 macOS 开发所专门制作的 IDE，可以在 App Store 中直接搜索下载。虽然也总有别的旁门左道可以绕过 Xcode 进行开发，不过还是那句话，为了减少不必要的麻烦，同时获得最原生的体验，用 Xcode 吧。

在大陆使用 App Store 下载 Xcode 可能非常慢，可以前往[Apple Developer](https://developer.apple.com/download/)用第三方下载器下载`.xip`格式的软件包。下载完毕后双击解压，将解压完成后的程序拖入 Applications 文件夹即可。如果无法双击解压，可以尝试通过命令行：

```
xip -x ~/Downloads/Xcode_11.2.xip
```

本系列教程基于平台：

-   macOS 10.15.2
-   Xcode 11.1 (11A1027)

## 上手 Xcode

打开 Xcode 后，创建我们的第一个 macOS App 项目。
![@2x](https://pic.rhinoc.top/mweb/15722485065746.jpg)

-   Product Name：应用的名称
-   Team：选择你的 Apple 开发者账户，或者选 None
-   Organization Name：你的企业名字或者你自己的名字
-   Organization Identifier：用来确认你是你。一般是`com.`加上 Organization Name。
-   Bundle Name：用来确认你的应用是你的应用。一般是 Organization Identifier 加上 Product Name。
-   Language：开发 macOS 使用的语言，可选 Objective-C 和 Swift。Swift 是如今开发 iOS/macOS 应用的标准语言，由 Apple 推出；在此之前开发者使用的是 Objective-C。
-   User Interface：用户界面，可选 SwiftUI、XIB 和 Storyboard。SwiftUI 最近刚由 Apple 推出，尚不成熟；而 Storyboard 是如今开发 iOS/macOS 应用的主流语言；更早之前开发者使用 XIB 开发 macOS 应用。

{% blockquote Mark Szymczyk https://www.swiftdevjournal.com/introduction-to-mac-development-create-a-project/ Swift Dev Journal %}
Storyboards let you see the app’s entire user interface in one place. Storyboards also make working with view controllers easier. But xib files make creating master-detail interfaces easier.

Storyboard 可以让你在一个地方管理所有用户界面，而 XIB 能让你更方便地创建主从结构的用户界面。
{% endblockquote %}

-   Create Document-Based Application：当你的应用是文档类型应用，且需要使用 Apple 文档体系时开启。
-   Document Extension
    -   Use Core Data：当需要在设备上保存本地数据时开启。
    -   Include Unit Tests & Include UI Test：当你的应用非常大，需要进行自动化测试的时候开启

创建完成项目后，就能看到 Xcode 的全貌了。
![](https://pic.rhinoc.top/mweb/15722521122242.jpg)

### 导航区域

导航区域的上方有 8 个选项卡，这里只谈谈最常用的三个：

![@2x](https://pic.rhinoc.top/mweb/15722545653537.jpg)

1. Project：项目文件
2. Search：全局搜索
3. Issue：报错导航

可以看到，在最左侧导航区域的文件选项卡中，Xcode 已经默认为我们生成了一些文件：

1. AppDelegate.swift：控制应用程序的启动、终止
2. ViewController.swift：控制程序第一次打开时的页面，如果选择的是 XIB 则不会有这个文件
3. Assets.xcassets：包含项目中包含的图标和图片
4. Main.storyboard：控制用户界面
5. Info.plist：保存应用程序基本信息
6. sample.entitlements：控制应用的能力和权限
7. sample.xcdatamodeld：开启 Core Data 后生成的模型文件

### 编辑区域

编辑区域显示的内容会根据你在导航区域选择的文件/条目而改变。如果你选择了`.swift`文件，那么你应该会看到代码编辑器；如果你选择了`.storyboard`文件，你会看到 Interface Builder。

在编辑区域的上方，你可以通过<ruby>面包屑<rt>breadcrumb</rt></ruby>导航栏快速切换文件，或是通过前进后退按钮在之前打开的文件中切换。

![](https://pic.rhinoc.top/mweb/15722549742733.jpg)

当我们在 Interface Builder 界面时，可以通过导航栏右边倒数第二个按钮打开 Asistant，显示与当前视图相关的代码文件。

![](https://pic.rhinoc.top/mweb/15722553510679.jpg)

### 审查区域

如果打开的是代码文件，那么审查区域应该只有 3 个选项卡：

![@2x](https://pic.rhinoc.top/mweb/15722556419936.jpg)

1. File Inspector：文件审查器，显示当前文件的详细信息
2. History Inspector：历史审查器，显示当前文件的历史变动
3. Quick Help：快速帮助，显示当前光标所在处的相关文档

如果打开的是视图文件，除了上面提到的三种选项卡，审查区域应该还有 6 个选项卡：

![@2x](https://pic.rhinoc.top/mweb/15722557968010.jpg)

1. Identity Inspector：设置空间的 class
2. Attributes Inspector：定义控件的属性
3. Size Inspector：定义控件的位置和尺寸
4. Connections Inspector：控制控件的连接情况
5. Bindings Inspector：查看和控制控件的绑定情况
6. View Effects Inspector：控制控件的动效

### 调试区域

调试区域会显示程序运行时的变量（左）和控制台输出（右）。
![](https://pic.rhinoc.top/mweb/15722570730171.jpg)

### 工具栏

![](https://pic.rhinoc.top/mweb/15722565964715.jpg)

1. Build&Run：编译并运行，长按可以显示更多操作
    1. Test：运行单元测试
    2. Profile：测试应用程序的性能
    3. Analyze：分析应用程序可能存在的问题
2. Stop：终止应用程序的运行
3. Status Bar：查看应用程序的运行状态
4. Object Library：控件库
5. Code Review：文件改动审阅
6. Hiding/Show Panes：控制导航区域、调试区域和审查区域的显示和隐藏
