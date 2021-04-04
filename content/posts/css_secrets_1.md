---
title: 《CSS揭秘》：引言
date: 2020-07-26
category: frontend
tags: ["css"]

---

## Web标准
### 标准的制定过程
W3C的职能：扮演论坛的角色，把某项技术的各方面聚集起来，最终产出标准，但这些技术规范基本上不是由W3C的工作人员编写完成的。
其中，CSS规范是由CSS工作组来编写的，工作组成员绝大部分是W3C会员公司（浏览器厂商、主流网站等）的职员，还有一部分特邀专家及W3C工作人员。
每项规范从最初启动到最终成熟，会经过以下过程：
1. 编辑草案（ED）
2. 首个公开工作草案（FPWD）
3. 工作草案（WD)：浏览器的早期实现通常从这个阶段开始
4. 候选推荐规范（CR）
5. 提名推荐规范（PR）
6. 正式推荐规范（REC）

### CSS的发展过程
1. CSS1：发表于1996年，内容较少，可以用68页A4纸呈现
2. CSS2：发表于1998年，规范的篇幅增加到480页
3. CSS3：非正式名词。包括CSS规范第三版和一些版本号还是1的新规范（例如flexbox、grid等）

### 浏览器前缀
背景：当实验性的技术被广泛应用于生产时，一旦技术有变动，使用这些技术的网站就会出现问题。

每个浏览器都可以实现实验性功能，但要加入前缀，例如Chrome的`-webkit-`，Firefox的`-moz-`，最终标准化的功能不会附带前缀，杜绝了出现冲突的可能。

存在问题：加了前缀的属性被滥用，当新特性标准化后难以维护，导致开发者们为了提前使用新功能写出复杂的代码。（先发制人地加上所有可能的浏览器前缀，再把无前缀的版本放在最后）

当前情况：
1. 使用自动化工具添加前缀
2. 浏览器厂商使用配置开关来启用实验特性，避免实验特性被滥用

## CSS编码技巧

### 尽量减少代码重复

反例：
```css
padding: 6px 16px;
border: 1px solid #446d88;
background: #58a linear-gradient(#77a0bb,#58a);
border-radius: 4px;
box-shadow: 0 1px 5px gray;
color: white;
text-shadow: 0 -1px 1px #335166;
font-size: 20px;
line-height: 30px;
```
<span style="padding: 6px 16px;border: 1px solid #446d88;background: #58a linear-gradient(#77a0bb,#58a);border-radius: 4px;box-shadow: 0 1px 5px gray;color: white;text-shadow: 0 -1px 1px #335166;font-size: 20px;line-height: 30px;">Yes!</span>

存在问题：
1. 改变字号时所有尺寸相关的属性需要改动
2. 改变颜色时所有颜色相关的属性需要改动

正例：
```css
padding: .3em .8em;
border: 1px solid rgba(0,0,0,.1);
background: #58a linear-gradient(hsla(0,0%,100%,.2),transparent);
border-radius: .2em;
box-shadow: 0 .05em .25em rgba(0,0,0,.5);
color: white;
text-shadow: 0 -.05em .05em rgba(0,0,0,.5);
font-size: 125%;
line-height: 1.5;
```
<span style="padding: .3em .8em; border: 1px solid rgba(0,0,0,.1);background: #58a linear-gradient(hsla(0,0%,100%,.2),transparent);border-radius: .2em;box-shadow: 0 .05em .25em rgba(0,0,0,.5);color: white; text-shadow: 0 -.05em .05em rgba(0,0,0,.5); font-size: 125%;line-height: 1.5;">Yes!</span> <span style="padding: .3em .8em; border: 1px solid rgba(0,0,0,.1);background: #58a linear-gradient(hsla(0,0%,100%,.2),transparent);border-radius: .2em;box-shadow: 0 .05em .25em rgba(0,0,0,.5);color: white; text-shadow: 0 -.05em .05em rgba(0,0,0,.5); font-size: 125%;line-height: 1.5; background-color:#6b0">OK</span> <span style="padding: .3em .8em; border: 1px solid rgba(0,0,0,.1);background: #58a linear-gradient(hsla(0,0%,100%,.2),transparent);border-radius: .2em;box-shadow: 0 .05em .25em rgba(0,0,0,.5);color: white; text-shadow: 0 -.05em .05em rgba(0,0,0,.5); font-size: 125%;line-height: 1.5; background-color:#c00">Cancel</span>

分析：
1. 除了按钮边框粗细是绝对值，其余都使用`em`相对值
2. 使用HSLA产生半透明的白色，字符长度更短
3. 小数数值都略去了整数位的0

其余的一些技巧：
1. 使用拆分的代码有时候更易于维护
2. 善用`currentColor`和继承

### 人眼的视觉特性

1. 人眼在看到完美垂直居中的物体时，会觉得并不居中，需要把这个物体上移才能取得理想的视觉效果。
2. 人眼会把圆形感知得比实际尺寸更小

结合我在《图像处理》课上学习到的知识，人眼还具有以下特性：
1. 人眼对蓝光不敏感，对红光和绿光敏感
2. 人眼对高频部分（图像边缘）不敏感
3. 当亮度发生跃变时，人眼会觉得亮测更亮，暗测更暗，就像看百叶窗一样（马赫效应）

### 响应式网页设计

Lea Verou给出的一些建议：
1. 使用百分比长度取代固定长度
2. 使用`max-width`使较大分辨率下也能得到固定宽度
3. 为替换元素（`img`,`object`,`video`,`iframe`等）设置`max-width: 100%`
4. 使用`background: cover`将图片完整地铺满容器，但需要考虑到移动设备的带宽限制
5. 使用多列文本时指定`column-width`而不是`column-count`，这样在小屏幕上能自动显示为单列布局
6. 不要滥用媒体查询

### 合理使用简写

展开式写法不会清空相关属性，可能会产生干扰。合理使用简写是一种良好的防卫性编码方式。

展开式属性和简写属性配合可以让代码更加DRY。

### 预处理器

预处理器的缺点：
1. CSS文件的体积和复杂度可能失控
2. 调试难度增加
3. 预处理器的编译有一定时延

以纯CSS起步，有当代码开始变得无法保持DRY时，才应该切换到预处理器。