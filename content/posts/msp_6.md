---
title: 电工实习（四）展馆灯光控制
date: 2019-07-14
category: embeded
tags: ["msp430"]

---

> 欢迎评论、友链、打赏～

软件设计结课啦，留下一个综合实验和一个小组大作业，这次讲讲综合实验吧。
要实现的功能如下：
> 该系统主要用于展览馆等需要解说员解说，且需要调节光线以达到最佳演示效果的场合。系统检测到外界声音后打开灯光，系统根据周边环境光的情况自动调整LED灯的亮度，以达到最佳展示效果（环境光线越低，LED灯亮度越高）。一定时间后（设置为5秒），如果没有检测到声音信号，则自动关闭LED灯，以达到节能目的。

## 相关模块
要实现`调节光线`和`检测外界声音`，就需要有能感应光线的光线传感器和感应声音的麦克风。这里的光线传感器用的是学校发的光敏电阻传感器，麦克风是口袋板板载的，而这次要控制的LED，也从以往熟悉的L1～L6换成了口袋板板载的大功率LED。

### 板载大功率LED
在MSP430F5529中，单片机电流不足以驱动大功率LED，使用的驱动电路是Pocket Kit上的H桥驱动电路。根据原理图，要点亮L7，需要OUT2置高电平，OUT1置低电平（原理图与实际硬件接线相反）。

![](https://pic.rhinoc.top/mweb/15631188990508.jpg)

而OUT1和OUT2的电平高低和NSLEEP（P1.5）、IN1（P2.4）、IN2（P2.5）有关，查表可得，当P1.5=1，P2.4=0，P2.5=1时可实现LED点亮。

![](https://pic.rhinoc.top/mweb/15631189266233.jpg)

相关接线图如图：
![](https://pic.rhinoc.top/mweb/15631189434179.jpg)

### 光线传感器
使用的光线传感器为光敏电阻传感器，其原理图及接线如图：
![](https://pic.rhinoc.top/mweb/15631189782933.jpg)


### 板载麦克风
麦克风输出信号经过TLV2764运放放大后经P6.0输出。
![](https://pic.rhinoc.top/mweb/15631157949027.jpg)

### 引脚汇总
![](https://pic.rhinoc.top/mweb/15631161812874.jpg)

## 程序设计
根据预期实验效果，可以知道LED点亮的条件是检测到声音信号，在此条件下，LED根据环境光强改变亮度。因此程序运行时先利用板载麦克风模块获取当前环境下的声音强度，当声音强度大于阈值时再利用光线传感器获取当前环境下的光强，根据光强的不同输出占空比不同的PWM波以调节LED亮度。由于声音信号消失后LED不是立即熄灭，而是在超时后熄灭，故还需在亮灯时增加一个延时函数。
流程图如下：
![](https://pic.rhinoc.top/mweb/15631190400577.jpg)

## 代码
```c
#define CPU_F ((double)1000000)
#define delay_us(x) __delay_cycles((long)(CPU_F*(double)x/1000000.0))
#define delay_ms(x) __delay_cycles((long)(CPU_F*(double)x/1000.0))

#include <msp430.h>

void InitIO()
{
    //配置LED
    P1DIR |= BIT5;
    P2DIR |= BIT4;
    P2DIR |= BIT5;
    P2SEL |= BIT4 + BIT5; //开启P2.4和P2.5外设功能

    //状态指示灯
    P8DIR |= BIT1; //有声环境时亮
    P3DIR |= BIT7; //安静环境时亮

    TA2CTL = TASSEL_2 + MC_3 + TACLR; //设置Timer_A控制寄存器
    TA2CCR0 = 512-1; //PWM周期
    TA2CCTL1 = OUTMOD_6;
    TA2CCTL2 = OUTMOD_6;
}

void LEDon(void)
{
    P1OUT |= BIT5;
    P2OUT &= ~BIT4;
    P2OUT |= BIT5;
}

void LEDoff(void)
{
    P1OUT ^= BIT5;
    P2OUT ^= BIT4;
    P2OUT ^= BIT5;
    TA2CCR1 = 0;
}

void InitADC()//初始化ADC
{
    ADC12CTL0 |= ADC12ON + ADC12MSC; //开启ADC，连续采样
    ADC12CTL1 |= ADC12CONSEQ_3; //选择序列通道多次循环采样转换
    ADC12CTL1 |= ADC12SHP; //采样信号源自采样定时器
    ADC12MCTL0 |= ADC12INCH_0; //麦克风P6.0对应0通道
    ADC12MCTL1 |= ADC12INCH_1 + ADC12EOS; //光敏P6.1对应1通道
    ADC12CTL0 |= ADC12ENC; //使能转换
}

void Lighter()
{
    int timeout = 50;
    while (timeout>0){
        float LightVotaBuff[9];
        int i = 0;
        for (i = 0; i < 9; i++)
        {
            float curVota = (float)ADC12MEM1/4096*3.3;//计算光敏元件电压
            int j = i-1;//数组已排列好的前部分
            while (j >= 0; curVota < LightVotaBuff[j])
            {
              LightVotaBuff[j+1] = LightVotaBuff[j]; //大的元素向后挪
              j--;  
            }
            LightVotaBuff[j+1] = curVota; //插入新值
            delay_ms(5);
        }
        float LightVota = LightVotaBuff[5];//取中位数滤波
        LEDon();
        TA2CCR1 = 100*LightVota*LightVota*LightVota/3.3; //呼吸灯亮度变化
        delay_ms(55);
        timeout--;
    }
}

int main(void)
{
    WDTCTL = WDTPW + WDTHOLD; //关闭看门狗
    InitIO();
    InitADC();

    while(1)
    {
        ADC12CTL0 |= ADC12SC; //开始采样转换
        float MicVota = (float)ADC12MEM0/4096*3.3;//计算麦克风电压

        if (MicVota < 1) //有人声时
        {
            delay_ms(50);
            if (MicVota < 1)
            {
                P8OUT |= BIT1;
                P3OUT &= ~BIT7;
                Lighter();
            }
        }
        else if(MicVota >= 1) //安静时
        {
            P8OUT &= ~BIT1;
            P3OUT |= BIT7;
            LEDoff();
        }
    }
}
```


## 实验结果
实验结果与预期实验效果相符。
亮光环境下：
![](https://pic.rhinoc.top/mweb/15631163402399.jpg)
弱光环境下：
![](https://pic.rhinoc.top/mweb/15631163554547.jpg)
打个响指：
![52ba745b-bf0a-4d32-82c0-5b1c07ef2432](https://pic.rhinoc.top/mweb/52ba745b-bf0a-4d32-82c0-5b1c07ef2432.gif)