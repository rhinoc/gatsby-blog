---
title: macOS新手开发教程（二）构建菜单栏应用
date: 2020-01-25
category: etc
tags: ["swift"]

---

## 本章目标

1. 一个呆在菜单栏的应用
2. Dock 中没有图标、打开时没有窗口
3. 左键点击菜单栏图标时打开一个 popover
4. 右键点击菜单栏图标时打开一个菜单

## 新建工程及配置

在 Xcode 新建一个 macOS APP 工程，选择语言为 Swift，使用 Storyboard 构建 UI。

![](https://pic.rhinoc.top/mweb/CleanShot%202020-01-25%20at%2013.15.01@2x.png)

![](https://pic.rhinoc.top/mweb/CleanShot%202020-01-25%20at%2013.17.39@2x.png)

这样，我们就得到一个初始的项目，如果运行这个项目，将打开一个没有内容的窗口。

![](https://pic.rhinoc.top/mweb/15799295921113.jpg)

在导航区可以看到项目中包括两个文件夹，一个是与项目名同名的文件夹，其下是构建程序的源代码，另一个`Products`存放编译后的应用，如果将编译后的应用拖到`Applications`文件夹就算安装好了。

-   AppDelegate.swift 负责应用程序的生命周期
-   ViewController.swift 负责设置 storyboard 中的视图
-   Main.storyboard 视图
-   Assets.xcassets 保存媒体文件
-   [Info.plist](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Introduction/Introduction.html) 信息属性配置文件
-   [...entitlements](https://developer.apple.com/documentation/bundleresources/entitlements) 权限配置文件

## 创建菜单栏应用

### 选择程序图标

在[Iconfont-阿里巴巴矢量图标库](https://www.iconfont.cn/)里找一个中意的图标，下载 18x18、36x36、54x54 三种尺寸。然后`Assets.xcassets`中新建一个 Image Set，更名为`StatusBarButtonImage`，再将下载好的三种尺寸图标分别拖入 1x、2x、3x。在 Attributes Inspector 中选择`Render As Template Image`以适应系统的黑暗模式。

![](https://pic.rhinoc.top/mweb/CleanShot%202020-01-25%20at%2013.56.11@2x.png)

### 在菜单栏创建图标

先修改`AppDelegate.swift`，在 class 内创建一个菜单栏图标：

```swift
let statusItem = NSStatusBar.system.statusItem(withLength:NSStatusItem.squareLength)
```

然后为这个菜单栏图标指定图标文件，在`applicationDidFinishLaunching`中写入：

```swift
if let button = statusItem.button {
  button.image = NSImage(named:NSImage.Name("StatusBarButtonImage"))
}
```

运行后菜单栏就会显示一个黑色幽灵图标：

![](https://pic.rhinoc.top/mweb/CleanShot%202020-01-25%20at%2013.59.28@2x.png)

暗黑模式下则是白色幽灵：
![](https://pic.rhinoc.top/mweb/CleanShot%202020-01-25%20at%2013.59.06@2x.png)

### 隐藏打开时的 Dock 栏图标和窗口

在`Info.plist`中增加一个键`Application is agent (UIElement)`，设置其类型为`Boolean`，值为`YES`。目的是告诉 Xcode 这是一个只在菜单栏显示，而不在 Dock 栏显示的代理应用。

剩下的就是干掉打开时显示的窗口了。凡是显示的东西，肯定和 UI 有关，凡是和 UI 有关，大半和`Main.storyboard`有关。打开`Main.storyboard`，可以看到里面有一个`Window Controller Scene`，将其删除。

![](https://pic.rhinoc.top/mweb/CleanShot%202020-01-25%20at%2014.10.39@2x.png)

这时候编译运行，就能够得到一个只在菜单栏显示的图标了。

### 设置点击打开 Popover

新建一个 Cocoa Class，命名为`PopoverViewController`，它将用来控制 Popover 的逻辑。

![](https://pic.rhinoc.top/mweb/15799331542833.jpg)

接下来将视图和逻辑绑定。`Storyboard.swift`中已经有一个视图了，不过绑定的是`ViewController.swift`，只需要设置 Custom Class 和 Storyboard ID 为`PopoverViewController`，然后就会发现之前所有的`View Controller`都变成了`Popover View Controller`，现在`ViewController.swift`也可以删除了。

![](https://pic.rhinoc.top/mweb/CleanShot%202020-01-25%20at%2015.10.05@2x.png)

回到`PopoverViewController.swift`，在末尾增加：

```swift
extension PopoverViewController {
  static func freshController() -> PopoverViewController {
    //获取对Main.storyboard的引用
    let storyboard = NSStoryboard(name: NSStoryboard.Name("Main"), bundle: nil)
    // 为PopoverViewController创建一个标识符
    let identifier = NSStoryboard.SceneIdentifier("PopoverViewController")
    // 实例化PopoverViewController并返回
    guard let viewcontroller = storyboard.instantiateController(withIdentifier: identifier) as? PopoverViewController else {
      fatalError("Something Wrong with Main.storyboard")
    }
    return viewcontroller
  }
}
```

最后打开`AppDelegate.swift`，在 class 内声明一个 Popover：

```swift
let popover = NSPopover()
```

再创建一个打开/关闭 Popover 的 Toggle：

```swift
@objc func togglePopover(_ sender: Any?) {
  if popover.isShown {
    closePopover(sender: sender)
  } else {
    showPopover(sender: sender)
  }
}

func ​showPopover(sender: Any?) {
 ​if let button = statusItem.button {
   ​popover.show(relativeTo: button.bounds, of: button, preferredEdge: NSRectEdge.minY)
 ​}
}

func ​closePopover(sender: Any?) {
 ​popover.performClose(sender)
}
```

然后在`applicationDidFinishLaunching`内设置点击图标时调用`togglePopover`，现在的`applicationDidFinishLaunching`应该是这样：

```swift
func applicationDidFinishLaunching(_ aNotification: Notification) {
        if let button = statusItem.button {
          button.image = NSImage(named:NSImage.Name("StatusBarButtonImage"))
          button.action = #selector(togglePopover(_:))
        }
        popover.contentViewController = PopoverViewController.freshController()
    }
```

编译运行后，点击菜单栏图标将出现一个 Popover，再次点击关闭。

![](https://pic.rhinoc.top/mweb/15799370862934.jpg)

### 配置 Popover 失去焦点后隐藏

上面的 Popover 还有个问题，不再次点击图标就不关闭。加上 Popover 又永远显示在屏幕的最顶层，可以说是留着碍眼关闭又麻烦。我们希望在 Popover 失去焦点的时候能自动关闭。

我们需要创建一个事件监视器，监视是否有鼠标按下等用户操作，如果这些操作不是对 Popover 做的，就关闭 Popover。

所以新建一个 Swift 文件，内容写入：

```swift
import Cocoa

public class EventMonitor {
  private var monitor: Any?
  private let mask: NSEvent.EventTypeMask
  private let handler: (NSEvent?) -> Void

  public init(mask: NSEvent.EventTypeMask, handler: @escaping (NSEvent?) -> Void) {
    self.mask = mask
    self.handler = handler
  }

  deinit {
    stop()
  }

  public func start() { //开启监视器
    monitor = NSEvent.addGlobalMonitorForEvents(matching: mask, handler: handler)
  }

  public func stop() { //关闭监视器
    if monitor != nil {
      NSEvent.removeMonitor(monitor!)
      monitor = nil
    }
  }
}
```

然后打开`AppDelegate.swift`，将监视器应用到程序中，在 class 中声明：

```swift
var eventMonitor: EventMonitor?
```

然后在`applicationDidFinishLaunching`末尾添加：

```swift
eventMonitor = EventMonitor(mask: [.leftMouseDown, .rightMouseDown]) { [weak self] event in
  if let strongSelf = self, strongSelf.popover.isShown {
    strongSelf.closePopover(sender: event)
  }
}
```

这样还不够，因为监视器并没有打开，我们修改`showPopover`和`closePopover`，让每次显示 Popover 时开启监视器，关闭 Popover 时关闭监视器。

```swift
func ​showPopover(sender: Any?) {
        if let button = statusItem.button {
            popover.show(relativeTo: button.bounds, of: button, preferredEdge: NSRectEdge.minY)
        }
        eventMonitor?.start()
    }

    func ​closePopover(sender: Any?) {
        popover.performClose(sender)
        eventMonitor?.stop()
    }
```

至此，一个简易的 Popover 程序就完成了，想在 Popover 中显示自定义内容，可以在 Storyboard 中拖入控件自行 DIY。

### 左键打开 Popover，右键打开菜单

trans 作为一个翻译软件，将 Popover 设置为主界面，用来进行翻译。不过有了主界面还不够，一般的菜单栏应用，都是可以通过右键打开一个小菜单，进而选择设置、退出等。

我们先在 Storyboard 中创建一个 Menu，将其拖入 Application Scene。

![](https://pic.rhinoc.top/mweb/CleanShot%202020-01-25%20at%2015.30.34@2x.png)

然后将 Menu 与 AppDelegate.swift 建立联系，先打开 Assistant：

![](https://pic.rhinoc.top/mweb/15799377421802.jpg)

然后按住`control`键，将 Menu 拖入 AppDelegate 中插入一个 outlet，命名为 menu。

![](https://pic.rhinoc.top/mweb/15799379299363.jpg)

之前我们为`statusItem.button`赋以`togglePopover`的动作。现在我们在 class 内新建一个 Handler 来接管`togglePopover`。

```swift
@objc func mouseClickHandler() {
        if let event = NSApp.currentEvent {
            switch event.type {
            case .leftMouseUp:
                togglePopover(popover)
            default:
                statusItem.menu = menu
                statusItem.button?.performClick(nil)
            }
        }
    }
```

然后将之前对`statusItem.button`的设置更改为：

```swift
if let button = statusItem.button {
          button.image = NSImage(named:NSImage.Name("StatusBarButtonImage"))
          button.action = #selector(mouseClickHandler)
          button.sendAction(on: [.leftMouseUp, .rightMouseUp])
        }
```

这时候编译运行会发现，先点左键出现 Popover，再点右键出现 Menu，但是再点击左键还是 Menu。这是因为一旦`statusItem.menu = menu`，图标的点击事件就被绑定锁死了。所以我们要在每次菜单关闭后`statusItem.menu = nil`，取消绑定。

在`AppDelegate.swift`的末尾增加：

```swift
extension AppDelegate: NSMenuDelegate {
    // 为了保证按钮的单击事件设置有效，menu要去除
    func menuDidClose(_ menu: NSMenu) {
        self.statusItem.menu = nil
    }
}
```

在`applicationDidFinishLaunching`内增加：

```swift
menu.delegate = self
```

再重新编译运行，就 OK 了。

## 参考资料

1. [Menus and Popovers in Menu Bar Apps for macOS | raywenderlich.com](https://www.raywenderlich.com/450-menus-and-popovers-in-menu-bar-apps-for-macos#toc-anchor-003)
2. [macOS 开发之状态栏小工具分别响应鼠标左右键单击 - 知乎](https://zhuanlan.zhihu.com/p/88235396)
3. [macOS 开发之菜单栏形式的状态栏小工具 - 知乎](https://zhuanlan.zhihu.com/p/87960477)
