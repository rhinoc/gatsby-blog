---
title: Hello World
date: "2015-05-01T22:12:03.284Z"
description: "Hello World"
tags: ["gatsby","blog"]
category: etc
---

[[info]]
|本页面用于Markdown的渲染测试。  
|This page is for markdown rendering test. 

## 段落 Paragraph

### 英文段落 English 
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut feugiat dui. Quisque bibendum ac mi et dignissim. Donec faucibus mi at enim dignissim rutrum. Fusce lobortis mi et dolor mattis venenatis. Aenean imperdiet, libero vitae rutrum iaculis, sem lacus tincidunt dolor, eget posuere est nulla eu erat. Etiam leo libero, laoreet at consectetur in, tincidunt in arcu. Donec interdum libero dui, a dapibus nunc maximus vel.

Nunc imperdiet varius elit non cursus. Aenean vel tellus nec dolor porta tincidunt at ac diam. Nullam id neque eros. Cras sed tempus nunc. Aenean turpis orci, pharetra nec congue sed, ultricies sed dui. Aliquam in mattis odio. Vivamus urna ante, fermentum id maximus ut, cursus vel metus. Phasellus viverra vel lacus et efficitur. Suspendisse pellentesque, massa a sagittis feugiat, tortor metus egestas ex, a fringilla dui est condimentum enim.

### 中文段落 Chinese with English
我采了你的花，呵，世界！I plucked your flower, O world!
我把它压在胸前，花刺伤了我。I pressed it to my heart and the thorn pricked.
日光渐暗，我发现花儿凋谢了，痛苦却存留着。When the day waned and it darkened, I found that the flower had faded, but the pain remained.

許多有香有色的花又將來到你這裏，呵，世界！More flowers will come to you with perfume and pride, O world!
但是我采花的時代過去了，黑夜悠悠，我沒有了玫瑰，只有痛苦存留著。But my time for flower-gathering is over, and through the dark night I have not my rose, only the pain remains.

### 注音 HTML Ruby Tag
<ruby>我采了你的花，呵，世界！<rt>I plucked your flower, O world!</rt></ruby>

### 文字装饰 Text Decoration
Emphasis, aka italics, with _asterisks_ or _underscores_. Strong emphasis, aka
bold, with **asterisks** or **underscores**. Combined emphasis with **asterisks
and _underscores_**. Strikethrough uses two tildes. ~~Scratch this.~~

## 链接 Link
[I’m a link](https://rhinoc.top)

I'm a [link](https://rhinoc.top) with text.

## 块引用 Blockquote
> 我采了你的花，呵，世界！I plucked your flower, O world！  
> 我把它压在胸前，花刺伤了我。I pressed it to my heart and the thorn pricked.  
> 日光渐暗，我发现花儿凋谢了，痛苦却存留着。When the day waned and it darkened, I found that the flower had faded, but the pain remained.  
> — <cite>Rabindranath Tagore</cite>, <cite>The Gardener: 57</cite>

## 列表 List
### 有序列表 Ordered List
1. first
2. second
    1. sub first
    2. sub second
        1. yet another first
3. third

### 无序列表 Unordered List
- first
- second
    * sub first
    * sub second
        * yet another first
- third

### 任务列表 Task List
- [x] first
- [ ] second
    - [ ] sub first
    - [x] sub second
        - [x] yet another first
- [ ] third


## 代码 Code
### 行内代码 Inline Code
这是行内代码 `code` 。（建议输入行内代码时使用空格与正文分隔。）

This is inline code: `code` .

### 代码块 Code Block

Plugins used:
* Highlight: https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/
* Copy button: https://github.com/iamskok/gatsby-remark-code-buttons
* File name bar: https://github.com/DSchau/gatsby-remark-code-titles

```bash:clipboard=false
print hello, world!
# comment here...
```

```html
<h1>hello, world!</h1>
<p>copy this block by clicking the top right button</p>
<!-- see https://github.com/iamskok/gatsby-remark-code-buttons for details -->
```

```js
console.log('hello, world!');
console.log('highlight this line ;D');// highlight-line
// see https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/ for details
```

```js:title=filename.js
console.log('hello, world!);
console.log('you can see filename in this block :)');
// see https://github.com/DSchau/gatsby-remark-code-titles for details
```

## 图片 Image

### 尺寸 Size
![](https://fakeimg.pl/200x300/)
![](../media/lm.png)
![](../media/ll.png)

![](https://fakeimg.pl/2000x200/)

### 图例 Figure Caption
![](https://fakeimg.pl/400x100/?text=online%20image%20without%20caption)
![](https://fakeimg.pl/400x100/?text=online%20image%20without%20caption)

![](https://fakeimg.pl/400x100/?text=online%20image%20without%20caption)
<!-- ![](../media/lw.png) -->

![alt](https://fakeimg.pl/400x100/?text=online%20image%20with%20caption "title")
![alt](https://fakeimg.pl/400x100/?text=online%20image%20with%20caption "title")

![alt](https://fakeimg.pl/400x100/?text=online%20image%20with%20caption%201 "title")
<!-- ![alt](../media/lc.png "title")

![alt](../media/lc.png "title")
![alt](../media/lc.png "title") -->

See links below for details:
* [gatsby-remark-figure-caption](https://www.gatsbyjs.com/plugins/gatsby-remark-figure-caption/)
* [gatsby-remark-images](https://www.gatsbyjs.com/plugins/gatsby-remark-images/)

## 动图 GIF

![](https://media.giphy.com/media/DjclSiVtiB11C/giphy.gif)
![](../media/gif.gif)

## 音视频 Audio & Video
Music Credit: [Music: https://www.purple-planet.com](https://www.purple-planet.com)

<audio src="../media/dreamcatcher.mp3" controls="controls"></>

<video src="../media/bigbuckbunny.mp4" controls="controls"></>


## 嵌套页面 Inline Frame
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/6_pru8U2RmM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 表格 Table

| Tables        |      Are      |   Cool |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned | \$1600 |
| col 2 is      |   centered    |   \$12 |
| zebra stripes |   are neat    |    \$1 |

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | `renders` | **nicely** |
| 1        | 2         | 3          |

| this      | is | a                   | super   | long | table  | for | markdown | rendering | test | .    | .  | .    | .          | . | . | . |
|-----------|----|---------------------|---------|------|--------|-----|----------|-----------|------|------|----|------|------------|---|---|---|
| generated | by | tablesgenerator.com | because | i    | really | do  | not      | want      | to   | type | so | many | characters | . | . | . |

## 水平分隔线 Horizontal Rule
---

## 自定义块 Custom Block
[[info|Info Title]]
|this is a info...  
|yet another line...

[[info]]
|this is a info without title...  
|yet another line...

[[danger|Warning Title]]
|this is a Warning...  
|yet another line...

[[danger]]
|this is a warning without title...  
|yet another line...

[[togglelist|Toggle list Title]]
|this is a toggle list...  
|yet another line...

* see [gatsby-remary-custom-blocks](https://www.gatsbyjs.com/plugins/gatsby-remark-custom-blocks/) for details.

## 标题 Heading

### 相邻 Sibling
# 一级标题 Heading 1
## 二级标题 Heading 2
### 三级标题 Heading 3
#### 四级标题 Heading 4
##### 五级标题 Heading 5
###### 六级标题 Heading 6

### 间隔 Separate
# 一级标题 Heading 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus suscipit libero non blandit. 

## 二级标题 Heading 2
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus suscipit libero non blandit.

### 三级标题 Heading 3
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus suscipit libero non blandit.

#### 四级标题 Heading 4
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus suscipit libero non blandit.

##### 五级标题 Heading 5
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus suscipit libero non blandit.

###### 六级标题 Heading 6
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus suscipit libero non blandit.
