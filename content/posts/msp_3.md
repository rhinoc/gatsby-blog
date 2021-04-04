---
title: 电工实习（一）基础GPIO实验
date: 2019-06-25
category: embeded
tags: ["msp430"]

---

> 之前短期的电赛培训里虽然有学MSP430，但是那时候都是引用学长写好的库函数，离底层太远，人太飘。

微控制器（MCU）、微处理器（MPU）和数字信号处理器（DSP）是目前最常用的3种可编程处理器。本课程所学的单片机MSP430属于微控制器。

*   特点：小巧灵活，成本低，易于产品化；抗干扰能力强。
*   应用：智能仪器仪表，变电站

由于是软件设计部分，所以还提了一下软件开发流程：  

```
项目立项 -> 需求定义 -> 系统设计 -> 编码开发 -> 版本发布 -> 缺陷跟踪  
集成测试 系统发布 跟踪维护  
```

回到硬件，依旧是熟悉的MSP430F5529的Launch Pad和配套的BoosterPack。由于是第一堂课，所以实验内容也还是熟悉的点亮LED🤦🏻‍♂️。

不过不同于之前的培训，这次要求用两种方法实现，分别是调用头文件法和使用固件库配置GPIO引脚控制法。（其实还有一种配置寄存器法，但是老师说这是架构师该操心的所以不要求）

## 实验内容

由于还没学数电，加上计算机组成原理这方面的知识完全靠以前看闲书的积淀，所以实验时并不清楚寄存器和位运算为何物。

**寄存器**：  
寄存器是CPU的有限存贮容量的高速存贮部件，用来暂存指令、数据和地址。

*   PxDIR：方向控制寄存器；1为输出，0为输入，默认为输入
*   PxIN（只读）：读取引脚的值
*   PxOUT：0为低电平/引脚拉低，1为高电平/引脚拉高
*   PxREN：用于启用上拉/下拉电阻（先要用PxDIR设置为输入），与PxOUT配合使用
*   PxIFG 中断标志寄存器
*   PxIE 允许中断寄存器
*   PxIES 中断边沿选择寄存器

<div class="table-container">

<table>

<thead>

<tr>

<th>PxDIR</th>

<th>PxREN</th>

<th>PxOUT</th>

<th>I/O配置</th>

</tr>

</thead>

<tbody>

<tr>

<td>0</td>

<td>0</td>

<td>X</td>

<td>输入，禁用电阻</td>

</tr>

<tr>

<td>0</td>

<td>1</td>

<td>0</td>

<td>输入，下拉</td>

</tr>

<tr>

<td>0</td>

<td>1</td>

<td>1</td>

<td>输入，上拉</td>

</tr>

<tr>

<td>1</td>

<td>X</td>

<td>X</td>

<td>输出，PxREN无效</td>

</tr>

</tbody>

</table>

</div>

**位运算**：

*   `&` 按位与：A&0=0 A&1=A
*   `|` 按位或：A|0=A A|1=1
*   `^` 按位异或
*   `~` 按位取反
*   `<<` 左移，右边补0，溢出舍弃；左移1位相当于乘2
*   `>>` 右移，无符号数高位补0，低位舍弃；右移1位相当于除以2

运算量只能是整型或字符型的数据，不能为浮点型。

### 调用头文件方法

思路：初始化引脚 -> 逻辑判断  

```c
#include <msp430.h>

void InitTo()
{
    P8DIR |= BIT1;//设置P8.1为输出
    P1DIR &=~ BIT2; //设置P1.2为输入
    P1REN = BIT2; //设置上拉电阻
    P1OUT = BIT2;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD; //关闭看门狗
    InitTo();
    while(1)
    {
        if (P1IN&BIT2) P8OUT |= BIT1;
        else P8OUT &=~ BIT1;
    }
}
```

常用位运算操作：  

```c
//设置P1.0输出并设置高电平  
P1DIR | = BIT0;  
P1OUT | = BIT0;  
  
//设置P1.4输出并设置低电平  
P1DIR | = BIT4;  
P1OUT ＆=〜 BIT4;  
  
//设置多个引脚输出并设置电平  
P1DIR | = BIT4 | BIT6;  
P1OUT | = BIT4 | BIT6;   
  
//将端口1的所有引脚设为输出并将其设置为高电平  
P1DIR = 0xFF;  
P1OUT = 0xFF;  
  
//设置上拉电阻  
P1DIR＆=〜BIT3;   
P1REN = BIT3;  
P1OUT = BIT3;  
```

### 固件库配置GPIO方法

原理：调用TI官方库函数。  
所以要先在Resource Explorer中下载对应的库函数（可能需要科学上网），如果在View下找不到Resource Explorer，可能是在Getting Started中将CCS设置为了Simple模式，取消即可。

库函数路径如下图，先点击右上角第三个按钮Download and Install之后，再点击中间的按钮导入到IDE。  
![](http://pic.rhinoc.top/2019-06-25-15614492128817.jpg)

之后，就可以在新导入的空项目中愉快地玩耍了。  
运用库函数编码会容易许多，因为函数的名字非常的easy。  

```c
#include "driverlib.h"

void InitIo()
{
    GPIO_setAsOutputPin(GPIO_PORT_P8,GPIO_PIN1);//设置P8.1为输出
    GPIO_setAsInputPinWithPullUpResistor(GPIO_PORT_P1,GPIO_PIN2);//设置P1.2为输入并设置上拉电阻
}

void main (void)
{
    InitIo();
    if (GPIO_getInputPinValue(GPIO_PORT_P1,GPIO_PIN2))
        GPIO_setOutputLowOnPin(GPIO_PORT_P8,GPIO_PIN1);
    else
        GPIO_setOutputHighOnPin(GPIO_PORT_P8,GPIO_PIN1);
}
```

### 跑马灯

思路：通过空循环实现延时，时间和主频有关，每次延时上一个灯灭，下一个灯亮；值得注意的是需要关闭看门狗。

```c
#include <msp430f5529.h>
void InitIo()
{
    P8DIR |= BIT1;
    P3DIR |= BIT7;
    P7DIR |= BIT4;
    P6DIR |= BIT3;
    P6DIR |= BIT4;
    P3DIR |= BIT5;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD;
    InitIo();
    int i = 0;
            P8OUT |= BIT1;
    while(1){
            for(i=0;i<5000;i++) ;
            P8OUT &=~ BIT1;
            P3OUT |= BIT7;
            for(i=0;i<5000;i++) ;
            P3OUT &=~ BIT7;
            P7OUT |= BIT4;
            for(i=0;i<5000;i++) ;
            P7OUT &=~ BIT4;
            P6OUT |= BIT3;
            for(i=0;i<5000;i++) ;
            P6OUT &=~ BIT3;
            P6OUT |= BIT4;
            for(i=0;i<5000;i++) ;
            P6OUT &=~ BIT4;
            P3OUT |= BIT5;
            for(i=0;i<5000;i++) ;
            P3OUT &=~ BIT5;
            P8OUT |= BIT1;
    }
    return 0;
}
```

### 中断

有关中断的知识，我在[之前一篇博文](https://rhinoc.top/post/msp_1.html)已经提过，故不赘述。

实现现象：当S1按键被按下松开后，LED1灯状态翻转。  

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

## 作业一

> 在点亮LED实验的基础上，修改程序，使按下按键一次，LED点亮，再次按下按键，LED熄灭。

```c
#include <msp430.h>

void InitTo()
{
    P8DIR |= BIT1;//设置P8.1为输出
    P8OUT &=~ BIT1;//默认不亮灯
    P1DIR &=~ BIT2; //设置P1.2为输入
    P1REN = BIT2; //设置上拉电阻
    P1OUT = BIT2;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD; //关闭看门狗
    InitTo();
    while(1)
    {
        if (P1IN&BIT2) {
            __delay_cycles(1); //空循环
        }
        else {
            P8OUT ^= BIT1;
            __delay_cycles(500000); //消除按键抖动
        }
    }
}
```

## 作业二

> 使用GPIO中断实现按键控制跑马灯：按下一个按钮，跑马灯开始；按下另一个按键，跑马灯停止

```c
#include "driverlib.h"
#include "msp430.h"
int flag = 0;
void InitTo()
{
    P8DIR |= BIT1;//设置LED灯
    P3DIR |= BIT7;
    P7DIR |= BIT4;
    P6DIR |= BIT3;
    P6DIR |= BIT4;
    P3DIR |= BIT5;

    P1DIR &=~ BIT2; //设置P1.2为输入
    P1REN = BIT2; //设置上拉电阻
    P1OUT = BIT2;
    P2DIR &=~ BIT3; //设置P2.3为输入
    P2REN = BIT3; //设置上拉电阻
    P2OUT = BIT3;

    P1IE = BIT2;//允许P1.2中断
    P1IES |= BIT2; //下降沿中断
    P2IE = BIT3;//允许P2.3中断
    P2IES |= BIT3; //下降沿中断

}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD; //关闭看门狗
    InitTo();
    _enable_interrupts(); //开启全局中断
    while(1)
    {
        if(flag==1){
            P3OUT &=~ BIT5;
            P8OUT |= BIT1;
            _delay_cycles(500000);//延时500毫秒
        }
        if (flag==1){
            P8OUT &=~ BIT1;
            P3OUT |= BIT7;
            _delay_cycles(500000);//延时500毫秒
        }
        if (flag==1){
            P3OUT &=~ BIT7;
            P7OUT |= BIT4;
            _delay_cycles(500000);//延时500毫秒
        }
        if (flag==1){
            P7OUT &=~ BIT4;
            P6OUT |= BIT3;
            _delay_cycles(500000);//延时500毫秒
        }
        if (flag==1){
            P6OUT &=~ BIT3;
            P6OUT |= BIT4;
            _delay_cycles(500000);//延时500毫秒
        }
        if (flag==1){
            P6OUT &=~ BIT4;
            P3OUT |= BIT5;
            _delay_cycles(500000);//延时500毫秒
        }
    }
}

#pragma vector=PORT1_VECTOR
__interrupt void Port_1_Key(void)
{
    P1IFG &= ~BIT2;//清除中断状态
    flag = 1;
    _delay_cycles(50000);//消除抖动
}

#pragma vector=PORT2_VECTOR
__interrupt void Port_2_Key(void)//中断函数
{
    P2IFG &= ~BIT3;//清除中断状态
    flag = 0;
    _delay_cycles(50000);//消除抖动
}
```

## 思考与分析

### MSP430的IO口都具备哪些功能？

指导书p16

<div class="table-container">

<table>

<thead>

<tr>

<th>端口</th>

<th>功能</th>

</tr>

</thead>

<tbody>

<tr>

<td>P1 P2</td>

<td>I/O 中断 片内外设功能</td>

</tr>

<tr>

<td>P3 ～ P11</td>

<td>I/O 片内外设功能</td>

</tr>

<tr>

<td>PJ</td>

<td>I/O JTAG功能复用</td>

</tr>

<tr>

<td>S COM</td>

<td>I/O 驱动液晶</td>

</tr>

</tbody>

</table>

</div>

### 与IO口相关的寄存器有哪些？

指导书p17-18

<div class="table-container">

<table>

<thead>

<tr>

<th>寄存器</th>

<th>功能</th>

</tr>

</thead>

<tbody>

<tr>

<td>PxDIR</td>

<td>输入/输出方向寄存器</td>

</tr>

<tr>

<td>PxIN</td>

<td>输入寄存器</td>

</tr>

<tr>

<td>PxOUT</td>

<td>输出寄存器</td>

</tr>

<tr>

<td>PxREN</td>

<td>上/下拉电阻使能寄存器</td>

</tr>

<tr>

<td>PxSEL</td>

<td>功能选择寄存器</td>

</tr>

<tr>

<td>PxDS</td>

<td>输出驱动强度寄存器</td>

</tr>

<tr>

<td>PxIE</td>

<td>中断使能寄存器</td>

</tr>

<tr>

<td>PxIES</td>

<td>中断触发沿选择寄存器</td>

</tr>

<tr>

<td>PxIFG</td>

<td>中断标志寄存器</td>

</tr>

</tbody>

</table>

</div>

### 如何去掉机械按钮产生的毛刺、抖动等现象？

1. 使用按位与`P1IFG&(~P1DIR)`，将输出IO排除，防止双键按下
2. 延时，消除前面的下降沿
3. 检测到后部下降沿后再延时，再检查电平 `P1IN&(Push_Key)==0`
4. 用PIIFG滤除IO影响后的`Push_Key`

### 去掉关闭看门狗的代码，程序能否正常运行，为什么？

不能，系统默认看门狗是开启，这样就必须不断喂狗，否则程序会自动复位。

## 参考资料

1.  [MSP430单片机GPIO编程入门教程](https://www.yiboard.com/thread-772-1-1.html)
2.  [Hexadecimal and Binary Number System basics for Embedded Programming](http://www.ocfreaks.com/hexadecimal-and-binary-number-system-basics-for-embedded-programming/)
3.  [Tutorial : Embedded programming basics in C – bitwise operations](http://www.ocfreaks.com/tutorial-embedded-programming-basics-in-c-bitwise-operations/)
