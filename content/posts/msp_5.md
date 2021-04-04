---
title: 电工实习（三）ADC & 电纸屏显示
date: 2019-07-08
category: embeded
tags: ["msp430"]

---

> 欢迎评论、友链、打赏～

## 实验内容
之前[一篇文章](https://www.rhinoc.top/msp_2/)提过ADC，这里不赘述了。
简单了解一下MSP430F5529中的ADC12模块，这里ADC12中的12不是第12的意思，而是表示ADC是12通道12位的。
![](https://pic.rhinoc.top/mweb/15625576130805.jpg)

### 比较器实验
拨动拨码电位器，拨码电位器的电平在0～3.3V变化。当电平高于1.5V时，LED亮，否则LED灭。

需要掌握ADC的初始化和电压的计算。由于ADC是12位，故其能表示的最大值为 $2^{12}-1=4095$ ，所以计算电压时，将获取到的输出值除以4095归一化再乘上最高电平3.3即可。

```c
#include "msp430.h"
void InitADC()//初始化ADC
{
    ADC12CTL0 |= ADC12ON + ADC12MSC; //开启ADC，连续采样
    ADC12CTL1 |= ADC12CONSEQ1; //选择转换序列模式
    ADC12CTL1 |= ADC12SHP; //采样信号源自采样定时器
    ADC12MCTL0 |= ADC12INCH_5; //拨码电位器对应5通道
    ADC12CTL0 |= ADC12ENC; //使能转换
}
void InitIo()//初始化IO口
{
    P8DIR |= BIT1;
    P3DIR |= BIT7;
    P8OUT &= ~BIT1;
    P3OUT &= ~BIT7;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD; //关闭看门狗
    InitIo();
    InitADC();
    while(1)
    {
        ADC12CTL0 |= ADC12SC; //开始采样转换
        float vota = (float)ADC12MEM0/4095*3.3;//计算电压
        if (vota>1.5)
            {
            P8OUT |= BIT1;
            P3OUT &=~ BIT7;
            }
        else {
            P3OUT |= BIT7;
            P8OUT &=~BIT1;
        }
        __delay_cycles(200000);
    }
}
```

### ADC实验
在上一个实验的基础上，实现拨动拨码电位器，LED顺序点亮。这里用`switch`会让代码好看很多。

```c
#include "msp430.h"
void InitADC()//初始化ADC
{
    ADC12CTL0 |= ADC12ON + ADC12MSC; //开启ADC，连续采样
    ADC12CTL1 |= ADC12CONSEQ1; //选择转换序列模式
    ADC12CTL1 |= ADC12SHP; //采样信号源自采样定时器
    ADC12MCTL0 |= ADC12INCH_5; //5通道输入，连接拨码电位器
    ADC12CTL0 |= ADC12ENC; //使能转换
}
void InitIo()//初始化IO口
{
    P8DIR |= BIT1;
    P3DIR |= BIT7;
    P7DIR |= BIT4;
    P6DIR |= BIT3;
    P6DIR |= BIT4;
    P3DIR |= BIT5;
    P8OUT &= ~BIT1;
    P3OUT &= ~BIT7;
    P7OUT &= ~BIT4;
    P6OUT &= ~BIT3;
    P6OUT &= ~BIT4;
    P3OUT &= ~BIT5;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD; //关闭看门狗
    InitIo();
    InitADC();
    while(1)
    {
        ADC12CTL0 |= ADC12SC; //开始采样转换

        switch (ADC12MEM0/683){ //4096/(3.3*6)=683
        case 0:
            P8OUT |= BIT1;
            P3OUT &= ~BIT7;
            P7OUT &= ~BIT4;
            P6OUT &= ~BIT3;
            P6OUT &= ~BIT4;
            P3OUT &= ~BIT5;
            break;
        case 1:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT &= ~BIT4;
            P6OUT &= ~BIT3;
            P6OUT &= ~BIT4;
            P3OUT &= ~BIT5;
            break;
        case 2:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT |= BIT4;
            P6OUT &= ~BIT3;
            P6OUT &= ~BIT4;
            P3OUT &= ~BIT5;
            break;
        case 3:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT |= BIT4;
            P6OUT |= BIT3;
            P6OUT &= ~BIT4;
            P3OUT &= ~BIT5;
            break;
        case 4:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT |= BIT4;
            P6OUT |= BIT3;
            P6OUT |= BIT4;
            P3OUT &= ~BIT5;
            break;
        case 5:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT |= BIT4;
            P6OUT |= BIT3;
            P6OUT |= BIT4;
            P3OUT |= BIT5;
            break;
        }
        __delay_cycles(100000);
    }
}
```

## 本章作业
默认存储在`MEM0`，要求将`MEM0`换成`MEM1`。所以要用`ADC12CTL1 |= ADC12CSTARTADD_1;`设置一下，对应的`ADC12MCTL0`也要换成`ADC12MCTL1`。
```c
#include "msp430.h"
void InitADC()//初始化ADC
{
    ADC12CTL0 |= ADC12ON + ADC12MSC; //开启ADC，连续采样
    ADC12CTL1 |= ADC12CONSEQ1;
    ADC12CTL1 |= ADC12SHP; //选择转换序列模式
    ADC12CTL1 |= ADC12CSTARTADD_1; //设置MEM1作为第一个寄存器
    ADC12MCTL1 |= ADC12INCH_5; //5通道输入，连接拨码电位器
    ADC12CTL0 |= ADC12ENC; //使能转换
}
void InitIo()//初始化IO口
{
    P8DIR |= BIT1;
    P3DIR |= BIT7;
    P7DIR |= BIT4;
    P6DIR |= BIT3;
    P6DIR |= BIT4;
    P3DIR |= BIT5;
    P8OUT &= ~BIT1;
    P3OUT &= ~BIT7;
    P7OUT &= ~BIT4;
    P6OUT &= ~BIT3;
    P6OUT &= ~BIT4;
    P3OUT &= ~BIT5;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD; //关闭看门狗
    InitIo();
    InitADC();
    while(1)
    {
        ADC12CTL0 |= ADC12SC; //开始采样转换
        switch (ADC12MEM1/683){
        case 0:
            P8OUT |= BIT1;
            P3OUT &= ~BIT7;
            P7OUT &= ~BIT4;
            P6OUT &= ~BIT3;
            P6OUT &= ~BIT4;
            P3OUT &= ~BIT5;
            break;
        case 1:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT &= ~BIT4;
            P6OUT &= ~BIT3;
            P6OUT &= ~BIT4;
            P3OUT &= ~BIT5;
            break;
        case 2:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT |= BIT4;
            P6OUT &= ~BIT3;
            P6OUT &= ~BIT4;
            P3OUT &= ~BIT5;
            break;
        case 3:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT |= BIT4;
            P6OUT |= BIT3;
            P6OUT &= ~BIT4;
            P3OUT &= ~BIT5;
            break;
        case 4:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT |= BIT4;
            P6OUT |= BIT3;
            P6OUT |= BIT4;
            P3OUT &= ~BIT5;
            break;
        case 5:
            P8OUT |= BIT1;
            P3OUT |= BIT7;
            P7OUT |= BIT4;
            P6OUT |= BIT3;
            P6OUT |= BIT4;
            P3OUT |= BIT5;
            break;
        }
        __delay_cycles(100000);
    }
}
```

## 思考与分析
### 如何采集负电压信号
MSP430F5529的ADC模块是可以接负压的，需要注意的是，要选择好ADC模块的参考电压。
![](https://pic.rhinoc.top/mweb/15625579964801.jpg)

### 如何对正弦波或三角波进行模数转换实现计数功能
三种方式：
1. 滞回比较器接计数器
搭一个迟滞比较器电路（负电平可以直接用二极管隔断，这样不需要双电源），其输出为整形后的脉冲信号，接到单片机外部中断入口，用定时中断控制计时或计数（依信号频率而定）就可以得到频率了
1. 使用2个ADC，其中一个极性反接
2. 将信号的电平抬升，使其波谷大于等于0

### 请尝试编写程序将采集的信号波形在电纸屏上显示
电纸屏是Pocket Kit板载的，要知道怎么用得看官方的文档，奈何官方只有指导书和例程。指导书中有关电纸屏几乎没有任何实质性的说明，例程也极其🤮。不过里面的库函数还是有用的，所以先在下面这个网址下载好例程。
[MSP430F5529口袋板实验程序_MSP430系列_华清科仪（北京）科技有限公司](http://www.huatsing.com/download/d_m4s/24.html)

库文件中`Init_buff()`作用是显示华清科仪的Logo，但是谁想显示什么东西背景都是你家Logo啊，改成下面👇这样的，就能实现初始化显示白屏。

```c
void Init_buff(void)
{
	int i;
	for(i=0;i<4000;i++)
	{
		DisBuffer[i]=0xFF;
	}
}
```
然后想要在电纸屏显示自己定义的内容，用`display()`这个函数将内容写入Buffer，使用方法参加Open Declaration。不过最后一个参数`fresh`是假的参数，没有任何作用。写入Buffer后还需要将Buffer内容显示在屏幕上，使用`DIS_IMG(1)`即可。

#### 代码
```c
#include <msp430.h> 
#include "Paper_Display.h"
#define TimesNewRoman 0
#define Arial 1
#define ArialBlack 2
#define size8 0
#define size16 1
volatile unsigned char DisBuffer[250*16];
int x = 0;

void InitADC()//初始化ADC
{
    ADC12CTL0 |= ADC12ON + ADC12MSC; //开启ADC，连续采样
    ADC12CTL1 |= ADC12CONSEQ1; //选择转换序列模式
    ADC12CTL1 |= ADC12SHP; //采样信号源自采样定时器
    ADC12MCTL0 |= ADC12INCH_5; //拨码电位器对应5通道
    ADC12CTL0 |= ADC12ENC; //使能转换
}

void InitIo()//初始化IO口
{
    P8DIR |= BIT1;
    P3DIR |= BIT7;
    P8OUT &= ~BIT1;
    P3OUT &= ~BIT7;
    PaperIO_Int(); //E-INK屏幕IO初始化
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD; //关闭看门狗
    InitIo();
    InitADC();
    INIT_SSD1673();
    Init_buff();//Buffer初始化为白色
    while(1)
    {
        ADC12CTL0 |= ADC12SC; //开始采样转换
        float vota = (float)ADC12MEM0/4095*3.3;//计算电压
        display("_", 8*x, 25*vota+5,TimesNewRoman,size8,0,0);//波形写入Buffer
        DIS_IMG(1);//屏幕载入Buffer
        if (x==20) {
            x=0;
            Init_buff();//显示超过一屏后清屏
        }
    }
}
```
#### 效果
![](https://pic.rhinoc.top/mweb/15625748581779.jpg)

## 参考链接
[MSP430ADC12转换模块总结](https://wenku.baidu.com/view/0ae018050740be1e650e9aed.html)
[Texas Instruments MSP430-FR5969 12-Bit ADC Setup Guide ](https://sites.ualberta.ca/~delliott/ece492/appnotes/2015w/G2_MSP430_ADC12/MSP430_ADC12_Application_Notes_V2.0.pdf)
[msp430f149可以通过设置ADC12的负参考电压，测量负电压吗？](https://e2echina.ti.com/question_answer/microcontrollers/msp430/f/55/p/70229/168203)
[如何用ADC采样方式来实现对一个正弦波的采样](https://bbs.csdn.net/topics/391029151)