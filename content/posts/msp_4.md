---
title: 电工实习（二）时钟与定时器
date: 2019-07-01
category: embeded
tags: ["msp430"]

---

> 欢迎评论、友链、打赏～

## 实验内容
### 实验一&作业一：系统时钟
单片机中程序依赖时钟而正常工作，这个时钟从哪里来呢？就是依靠振荡器。一定要区分清楚时钟和时钟源。

MSP430中有3个时钟：
* ACLK：辅助时钟
* MCLK：系统主时钟
* SMCLK：子系统时钟

5个振荡器（时钟源），分别是：
* **XT1**CLK：外部时钟源，有低频LF和高频HF两种模式
* **XT2**CLK：外部高频时钟源
* **VLO**CLK：低功耗内部低频时钟源
* **REFO**CLK：低频修整内部参考时钟源
* **DCO**CLK：片内数字控制时钟源

前面说了，振荡器（时钟源）驱动时钟，那么这个实验里我们要做的，就是将时钟和时钟源绑定。如何绑定呢？这就要请出UCS寄存器了。

我们只需要知道以下几种UCS寄存器：
* UCSCTL4：为SMCLK、ACLK、MCLK选取信号源

| BIT | Field | 时钟 | 默认值 | 默认值对应选项 |
| --- | --- | --- | --- | --- |
| 10-8 | SELA | ACLK | 0 | XT1CLK |
| 6-4 | SELS | SMCLK | 4 | DCOCLK |
| 2-0 | SELM | MCLK | 4 | DCOCLK |

* UCSCTL6：用来开启/关闭时钟源

| BIT | Field | 作用 | 默认 |
| --- | --- | --- | --- |
| 8 | XT2OFF | 关闭XT2 | 关闭 |
| 0 | XT1CLK | 关闭XT1 | 关闭 |

* UCSCTL7：振荡器故障标志位寄存器
* SFRIFG1：振荡器故障中断使能寄存器


| Name | 功能 | 默认 |
| --- | --- | --- |
| OFIE | 振荡器故障中断使能 | 0 |
| OFIFG | 振荡器失效中断标志位 | 1 |
| WDTIE | 看门狗在间隔定时器模式下的中断使能 | 0 |
| WDTIFG | 看门狗中断标志位 | 0 |

实验一要求使用XT1驱动ACLK，引脚P1.0输出频率为32768Hz的方波。作业一要求使用XT2驱动SMCLK，引脚P2.2输出频率为4MHz的方波。

由于一些不可描述🙅‍♂️的原因，XT2驱动的背书是XT1也要开启（不然输出是1MHz），所以索性实验一和作业一写在一起。

#### 代码

```c
#include <msp430.h> 

int main(void)
{
	WDTCTL = WDTPW | WDTHOLD;	// stop watchdog timer

	P1DIR |= BIT0;
	P1SEL |= BIT0; //ACLK P1.0

	P2DIR |= BIT2;
	P2SEL |= BIT2; //SMCLK P2.2

	P5SEL |= BIT4+BIT5; //Select XT1
	P5SEL |= BIT2+BIT3; //Select XT2

	UCSCTL6 &= ~XT1OFF; //turn on XT1
	UCSCTL6 &= ~XT2OFF; //turn on XT2
	UCSCTL6 |= XCAP_3; //可有可无
	UCSCTL3 = 0;

	while(SFRIFG1 & OFIFG) //循环，直至稳定
	{
	    UCSCTL7 &=~ (XT2OFFG+DCOFFG+XT1LFOFFG); //复位振荡器故障标志位寄存器	    SFRIFG1 &=~ (OFIFG); //清除振荡器失效中断标志位
	    UCSCTL4 &= (UCSCTL4&(~(SELA_7|SELM_7)))|SELA_0|SELM_0; //SMCLK&MCLK -> XT1
	}

	UCSCTL6 &=~ (XT1DRIVE_3);  //
	UCSCTL4 = SELA__XT1CLK + SELS__XT2CLK + SELM_0;//选取信号源，赋值使用=而非|=

	return 0;
}
```
#### 现象
P1.0输出
![](https://pic.rhinoc.top/mweb/15619931459260.jpg)

P2.2输出
![](https://pic.rhinoc.top/mweb/15619931565585.jpg)

#### 坑与土
这个实验有一些坑，需要注意。
1. XT2驱动SMCLK输出是1MHz的方波。这个老师说了，从硬件上来看，XT1和XT2没有关系，但是实际使用中，必须要开XT1才能XT2才能正常驱动时钟。
2. 去掉电容`XCAP_3`结果依然正确。这个某只🐟问了老师，老师说电容在高频电路中可以放置电压翻转但是低频中就没什么作用。

一些同学对此实验难以下手，很大原因是没有搞清楚时钟和时钟源的关系，以及没有去看硬件模块结构图。👇祭出一张图，给我认真看，仔细看。
![](https://pic.rhinoc.top/mweb/15619931677200.jpg)

还有就是有些同学不知道怎么用寄存器，其实在CCS中右键函数名称Open Declaration就什么都知道了。

### 看门狗定时功能实验（一）

要求：使用看门狗定时器功能产生周期为64ms的方波，选定某一引脚作为这个方波的输出。

这个了解了看门狗中断的工作原理就很简单。简单来说，程序一开始跑的是`main`里面的代码，但由于我们开启了看门狗并且设定了对应的中断处理函数，所以当程序运行到一定时间，这只狗就饿了，程序开始运行`watchdog_timer`里面的代码。

那怎么产生64ms周期的方波呢？首先要注意这个64ms是要分为32ms的高电平和32ms的低电平，那我们让看门狗每32ms饿一次，每次饿的时候电平翻转（高<->低）就好了。

#### 代码

```c
#include "msp430.h"

int main(void)

{
    WDTCTL = WDT_MDLY_32; //复位时间间隔为32ms，总周期为64ms
    SFRIE1 |= WDTIE; //使能WDT中断
    P1DIR |= BIT0; //P1.0输出
    P1OUT |= BIT0;
    _enable_interrupts(); //开启全局中断
    while(1)
    {
        _NOP();//无操作
    }
}

#pragma vector=WDT_VECTOR //看门狗中断
__interrupt void watchdog_timer(void)
{
    P1OUT ^= BIT0; //P1.0取反
}
```

#### 现象
![](https://pic.rhinoc.top/mweb/15619931876686.jpg)

### 看门狗定时功能实验（二）& 作业二
实验现象：看门狗定时器中断时，L1以1Hz左右的频率闪烁；以高于中断频率的频率按下按钮时喂狗，L1常亮或常灭。
作业二要求实验现象：增加一个蜂鸣器功能，正常状态时蜂鸣器以1Hz频率发声，触发看门狗中断时蜂鸣器以4Hz频率发声。

作业二相当于在实验的基础上迭代开发，所以也索性一次写了。

这里有一些点需要注意：
1. 喂狗代码即看门狗初始化代码
2. `PORT_1`的中断要能中断看门狗的中断，所以看门狗的中断函数中需要`_enable_interrupts();`

#### 代码
```c
#define CPU_F ((double)1000000)
#define delay_us(x) __delay_cycles((long)(CPU_F*(double)x/1000000.0))
#define delay_ms(x) __delay_cycles((long)(CPU_F*(double)x/1000.0))

#include <msp430.h>
void InitIO()
{
    P3DIR |= BIT6; //蜂鸣器输出引脚
    P8DIR |= BIT1;
    P1DIR &=~ BIT2; //设置P1.2为输入
    P1REN = BIT2; //设置上拉电阻
    P1OUT = BIT2;
    P1IE = BIT2;//允许P1.2中断
    P1IES |= BIT2; //下降沿中断
}
int main(void)
{
    WDTCTL=WDTPW+WDTCNTCL+WDTTMSEL+WDTIS1;//设置看门狗
    InitIO();
    _enable_interrupts();
    SFRIE1 = WDTIE;//使能看门狗中断
    P3OUT |= BIT6;
    while(1)
    {
        P8OUT |= BIT1;
        delay_ms(1000);
        P3OUT ^= BIT6;
    }
}

#pragma vector=WDT_VECTOR
__interrupt void watchdog_timer(void)
{
    _enable_interrupts();
    int count = 0;
    while(1)
    {
        delay_ms(250);
        P3OUT ^= BIT6;
        count ++;
        if (count==2)
        {
            P8OUT ^= BIT1;
            count = 0;
        }
    }
}

#pragma vector=PORT1_VECTOR
__interrupt void Port_1_Key(void)//中断函数
{
    _enable_interrupts();
    WDTCTL=WDTPW+WDTCNTCL+WDTTMSEL+WDTIS1;//喂狗
}
```

### 定时器Timer_A实验（一）
利用Timer_A输出周期为512/32768=15.625ms，占空比分别为75%（P1.2）和25%（P1.3）的矩形波。

这里利用XT1输出频率为32768Hz来做。

#### 代码
```c
#define CPU_F ((double)1000000)
#define delay_us(x) __delay_cycles((long)(CPU_F*(double)x/1000000.0))
#define delay_ms(x) __delay_cycles((long)(CPU_F*(double)x/1000.0))

#include <msp430.h>
void InitIO()
{
    TA0CTL = TASSEL_1+TACLR; //设置Timer_A控制寄存器
    TA0CCR0 = 512-1; //PWM周期
    TA0CCTL1 = OUTMOD_7;
    TA0CCR1 = 384; //75%*512
    TA0CCTL2 = OUTMOD_7;
    TA0CCR2 = 128; //25%*512

    P1DIR |= BIT2;//P1.2 输出
    P1SEL |= BIT2;
    P1DIR |= BIT3;//P1.3 输出
    P1SEL |= BIT3;
    TA0CTL |= MC_1;//增计数模式
}
int main(void)
{
    WDTCTL = WDTPW + WDTHOLD; //关闭看门狗
    InitIO();
    while(1)
    {
    }
    return 0;
}
```

#### 现象
![](https://pic.rhinoc.top/mweb/15619932304973.jpg)

### 定时器Timer_A实验（二）中断 & 作业三
运用定时中断功能实现对LED的定时亮灭和蜂鸣器发生频率控制。S1按下后每50msL1闪烁一次，同时蜂鸣器发声；S2按下后L1停止闪烁，蜂鸣器停止发声。

#### 代码

默认SMCLK时钟频率为1MHz，也就是一秒钟产生 $10^6$ 次脉冲。要求设置比较值为50000，而 $10^6\div50000=20$ ，也就是Timer_A每秒触发20次，周期即50ms。

> 按键还是不很灵敏，奈何我只会用延时。🙈

```c
#define CPU_F ((double)1000000)
#define delay_us(x) __delay_cycles((long)(CPU_F*(double)x/1000000.0))
#define delay_ms(x) __delay_cycles((long)(CPU_F*(double)x/1000.0))

#include <msp430.h>
#include <stdio.h>

int i = 0;
void InitIO()
{
    P8DIR |= BIT1;//设置LED灯
    P8OUT &=~ BIT1;//默认不亮
    P3DIR |= BIT6;//设置蜂鸣器

    P1DIR &=~ BIT2; //设置P1.2为输入
    P1REN = BIT2; //设置上拉电阻
    P1OUT = BIT2;
    P1DIR &=~ BIT3; //设置P1.3为输入
    P1REN = BIT3; //设置上拉电阻
    P1OUT = BIT3;
}

void main(void)
{
    WDTCTL = WDTPW|WDTHOLD;//关闭看门狗
    InitIO();
    TA0CTL = TASSEL_2 + MC_1 + TACLR;//配置TA控制寄存器，时钟源为SMCLK
    TA0CCTL0 = CCIE;//允许TA中断
    TA0CCR0 = 50000;//设置比较值 对应50ms
    while(1)
    {
        if (!(P1IN&BIT2))
        {
            delay_ms(20);
            if (!(P1IN&BIT2))
            {
                while(!(P1IN&BIT2));
                _enable_interrupts();//开启全局中断
            }
        }
        if (!(P1IN&BIT3))
        {
            delay_ms(20);
            if (!(P1IN&BIT3))
            {
                while(!(P1IN&BIT3));
                _disable_interrupts();//关闭全局中断
            }
        }
    }
}

#pragma vector = TIMER0_A0_VECTOR
__interrupt void TIMER0_A0_ISR(void)
{
    P8OUT ^= BIT1;
    P3OUT ^= BIT6;
}
```

#### 作业
时钟频率/比较值=蜂鸣器频率
比较值=时钟频率/蜂鸣器频率
所以可以通过改比较值来更改蜂鸣器的音调。
但是实际去把比较值设置为1M，发出声音的不是1Hz的频率，所以可能有个下限，（也可能我的理解有问题🤨）。

只是要求改变频率的话，给`TA0CCR0`赋新值就好了。就懒得写代码了，有兴趣的同学可以改这个然后让蜂鸣器唱歌。我之前玩Arduino的时候搞过，可以参考[这一篇博文](https://rhinoc.top/arduino_3/)。

## 思考与分析
1. 主函数中，没有调用中断子程序，中断子程序为什么能被执行？何时被执行？
百度知道的。

    程序中断和调用子程序的区别：
    
    * 子程序调用是预先安排好的，程序中断是随机发生的；
    * 调用子程序，是为主程序服务的，而中断程序与主程序的程序毫无关系；
    * 子程序是由调用指令给出目标地址，中断是通过隐指令获得中断服务程序的入口地址
    
    大概意思就是：
    
    * 中断程序不同于子程序，不需要主函数`main`调用就能执行。
    * 中断服务程序只需要满足一定条件即可执行，比如定时器/计数器（在写入定时器中断服务程序的前提下）只需要计数“计满”即可触发中断服务程序；外部中断（在写入外部中断的服务程序的前提下）只需要触发外部中断引脚即可自动执行，不需要主函数调用。
    * 子程序完全为主程序服务的，两者属于主从关系，主程序需要子程序时就去调用子程序，并把调用结果带回主程序继续执行。而中断服务程序与主程序两者一般是无关的，不存在谁为谁服务的问题，两者是平行关系。

2. Timer_A定时器都有哪些工作模式，如何配置？
工作模式：捕获、比较、PWM输出、内部计时
配置方式：`TAxCTL`中的MC位控制计时；`TACCTLx`中的`CAP=1`设置捕获模式；`TACCTLx`中的`CAP=0`设置比较模式；寄存器`TAxCCRx`控制PWM。

3. 如何通过定时器设定蜂鸣器发声的音调？
通过更改`TA0CCR0`修改计数，从而改变延时，进而改变蜂鸣器发声的频率（音调）。

## 参考链接
1. [S.D.Lu的MSP430入门学习笔记(4)：时钟选择(2)VLO、LFXT1和XT2](https://wenku.baidu.com/view/227a211c852458fb760b5605.html)
2. [MSP430F5529 看门狗的设置](https://www.cnblogs.com/qingfengshuimu/p/4356682.html)
3. [msp430f5529 pwm源程序](https://www.51hei.com/bbs/dpj-127749-1.html)
4. [MSP430定时器控制PWM输出 （MSP430入门）](https://blog.csdn.net/qq_35813104/article/details/72823234)
5. [MSP430功能模块详解系列之——TimerA](https://www.cppblog.com/coloerful/articles/85409.html)
6. [单片机MSP430 - Timer_A 定时器中断程序](https://www.eeworld.com.cn/mcu/article_2018050438971.html)