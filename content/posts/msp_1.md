---
title: 电赛培训（一）MSP430入门
date: 2019-03-15
category: embeded
tags: ["msp430"]

---

## 概述

学校电赛培训使用的开发板是MSP430F5529LP，属于MSP430系列，是一款低功耗的微控制器（MCU）产品。

如果有像我一样有接触过经典的51单片机、Arduino和Raspberry Pi这些开发板的朋友，可能会想知道MSP430和它们的区别，可以参考：  
[物联网系统平台开发，硬件开发板怎么选择？](https://www.zhongkerd.com/news/content-1439.html)  
[Arduino、arm、树莓派、单片机四者有什么不同？—— 知乎](https://www.zhihu.com/question/21045562)

知乎上有个很有意思的比喻：

*   Arduino - 凯美瑞
*   ARM - V型发动机
*   树莓派 - 帕萨特
*   单片机 - 小轿车

为了更系统的理解，我画了一张思维导图：  
![](https://pic.rhinoc.top/15532246992542.jpg)

回到主角MSP430，TI在这个系列的产品主打特点就是“超低功耗”，功耗在uA级（相比之下，51单片机的功耗在mA级）。  
除了MSP430F5529LP这块Launch Pad，学校还发了一个Hautsing Instruments针对前者的Pocket Kit。

## 串口监视器

玩嵌入式开发，自然不得不提起串口通讯（说白了就是电脑和开发板通讯）。串口通讯需要串口监视器作为通讯的媒介平台，不过，不同于Arduino IDE自带有串口监视器，这里需要自己额外找串口监视软件。macOS可以直接使用终端自带的`screen`命令。  
在终端输入：  

```
$ ls /dev/cu.*  
screen /dev/cu.usbserial 9600  
```

## 实验三 GPIO中断输入，按钮控制LED

前两个实验都比较简单，这里就只记录一下实验三。  
什么是中断呢？就拿看电视打个比方吧。电视上正在放CCTV-1，这时候你用遥控器调台到CCTV-6，这个过程就包括了中断。电视机其实一直在执行两件事——播放节目以及检查是否有收到遥控器发过来的信号。当没有收到遥控器的信号时，电视机就持续播放当前频道的节目，当收到信号时，就根据信号指令做出相应操作。  
在实验三中，程序就是一直监听是否有按钮被按下，如果按钮按下就执行点亮LED的操作。

### 怎么看原理图

以《MSP430F5529 Pocket Lab Schematic》中的按钮部分为例：  
![](https://pic.rhinoc.top/15537795444813.jpg)  
首先我们要明确目的——要从原理图中找什么？在实验三中，我们需要知道LED灯`L1`和按钮`S1`的<ruby>端口<rp></rp><rt>Port</rt></ruby>和<ruby>引脚<rp></rp><rt>Pin</rt></ruby>。（有关什么是端口和引脚，可以简单理解为一块板子上有多个端口，每个端口上有多个引脚）  
这里以`S1`为例，从图上可以看到`S1`在`P1.2`上，也就是端口1上的引脚2的意思。

### 为什么要上拉电阻

凡是涉及按钮的操作，就都逃不开上拉电阻的设置。  
为什么要设置上拉电阻？因为按钮在没有被按下的时候的电平状态是不确定的，可能是高电平也可能是低电平。当我们设置了上拉电阻时，按钮的电压就被抬高了，电平也就确定为高电平了。所以我们**没有按下按钮时，按钮处于高电平状态**，反之处于低电平状态。

### 代码

```c
#include "driverlib.h"
#include "msp430.h"

void InitTo()
{
    P8DIR |= BIT1;//设置P8.1为输出
    P1DIR &=~ BIT2; //设置P1.2为输入
    P1REN = BIT2; //设置上拉电阻
    P1OUT = BIT2;

    P1IE = BIT2;//允许P1.2中断
    P1IES |= BIT2; //下降沿中断

}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD; //关闭看门狗
    InitTo();
    _enable_interrupts(); //开启全局中断
    while(1)
    {
    }
}

#pragma vector=PORT1_VECTOR
__interrupt void Port_1_Key(void)//中断函数
{
    P1IFG &= ~BIT2;//清除中断状态
    P8OUT ^= BIT1;//LED状态翻转
}
```

