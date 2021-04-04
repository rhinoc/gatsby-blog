---
title: Arduino基础（一）简单介绍与数字输入和判断
date: 2018-10-23
category: embeded
tags: ["arduino"]
---

先开箱一个翁凯老师推荐的Ardublock，感觉某些时候用Ardublock效率还是很高的。  
![](https://pic.rhinoc.top/15403068918334.jpg)

> 关于硬件颜色的小贴士：  
> 红色-电源-B  
> 黑色-地-G  
> 绿色-信号-S

## 硬件介绍

### Arduino开发板

![](https://pic.rhinoc.top/15403073077500.jpg)

> 关于数字引脚的小贴士：  
> 共有14个（0-13），其中13是关联板载LED灯，一般避开0和1，因为0和1一般做串口。

### 面包板

![](https://pic.rhinoc.top/15403076036764.jpg)

*   两侧有凸起——可扩展
*   背后有双面胶——可贴附

### 面包线&杜邦线

![](https://pic.rhinoc.top/15403075521960.jpg)  
面包线：两头都是针

## 实验一 Button&Blink

详细资料：[按键控制LED实验——Arduino中文社区](https://www.arduino.cn/thread-74478-1-1.html)  
主要注意一下按键的内部构造：  
![](https://pic.rhinoc.top/15404669185878.jpg)  
也就是说，按键按下的时候，电阻和按键所在线路导通。

### 连接示意图

![](https://pic.rhinoc.top/15404664290831.jpg)

### 代码

```c
#define LED 13 
#define BUTTON 3 

int val=0; 
int state=0; 

void setup() { 
  // put your setup code here, to run once: 
  pinMode(LED,OUTPUT); 
  pinMode(BUTTON,INPUT);  
  Serial.begin(9600);
}
void loop() { // put your main code here, to run repeatedly: 
  val = digitalRead(BUTTON);
  Serial.println(val);
  if(val==HIGH){
    if(state==1){
       digitalWrite(LED,LOW);
       state=0;
    }else{
      digitalWrite(LED,HIGH);
      state=1;
    }
  }
  while(val==HIGH){
    delay(200);
    break;
    }
} 
```

### 问题及解决方案

有时候按下按键，灯的亮灭状态并不切换，所以代码里加了串口输出来调试，发现是程序循环一次的时间太短，按钮按下的时间稍长，就容易被判定成多次按下按钮。  
解决办法也很简单，就是在最后增加一个`while`循环，当判断到按键还是按下的状态时给一个延迟，防止误判。

### 成果演示

最后来一张像素渣到爆炸的GIF感受一下：  
![](https://pic.rhinoc.top/soogif1%203.gif)


