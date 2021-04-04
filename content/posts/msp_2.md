---
title: 电赛培训（二）ADC&CCS基本操作
date: 2019-03-28
category: embeded
tags: ["msp430"]

---


## ADC

<ruby>模数转换器<rp></rp><rt>Analog-Digital Converter</rt></ruby>简称为ADC，顾名思义，就是把模拟信号通过采样转换为数字信号。在单片机中，我们经常会用到一些传感器来实现人机交互。像在上一节中最基础的按钮就是一个人机交互的例子，表面上是人对按钮施加压力，内部却是按钮所在电路的通断，再深入一点就是按钮电位的高低。不过在按钮这个例子中，我们只有高电平和低电平，就像0和1，是数字信号。但是其他的传感器，比如光敏电阻、拨码电位器这些，它们反映出来的数字并不是非0即1，而是有一定范围的数据，这时候就需要ADC了。

### 代码

```c
#include <msp430f5529.h>
#include <driverlib.h>
#include <main.h>       //delay_ms
#include <LedLib.h>
#include <ButtonLib.h>
#include <UartLib.h>

// 全局变量定义区，在不同函数中都能使用
int flag=0;     //做为ADC值更新的标志
int adcnum1=0; //ADC读取值

void ADC_Init(); //没有单独做成库，如果想打包成库，请参考自编库MyLib的写法
int main()
{
    // 变量定义区
    float vot = 0;

    //关闭看门狗
    WDT_A_hold(WDT_A_BASE);

    // 硬件初始化
    ledInit(LED_ALL);
    BtnInit(S_ALL);
    BtnInterruptInit(S_ALL);
    UartA1_Init(); // 默认波特率为9600，在UartLib中可修改
    ADC_Init();     //需要初始化！具体函数在main后面！
    __bis_SR_register(GIE);     //开启全局中断
    // 建立一个大循环一直读取ADC数值
    // 能不能直接在循环里读取而不用中断呢？just try it!
    while (1)
    {
        //开始ADC12模块的采样和转换功能，注意第二个变量指的是应用于那个MEMORY，需要根据实际配置情况更改
        //具体各个参量的功能，在adc12_a.h中查看，或库函数用户手册
        ADC12_A_startConversion(ADC12_A_BASE,ADC12_A_MEMORY_0,ADC12_A_SINGLECHANNEL);
        delay_ms(1000);
        // 如果没有改变就不输出
        if(flag)
        {
            uartA1_printf("ADC: %d ",adcnum1);
            vot = (float)(adcnum1)/4096*3.3;
            uartA1_printf("V: %d \r\n", (int)vot);
            flag=0; //使用之后标志清零
        }
        //for Debugger
        __no_operation();
    }


    //For debugger，不执行任何具体的操作
    __no_operation();

    return 0;
}

// ADC初始化函数，在本例中只对P6.5和MEMORY0进行了初始化，并将两者绑定在一起
// 其中的各个函数的使用和调用顺序都是根据官方example写的，是结构化的内容，在这个结构上改就行了
void ADC_Init()
{
    //P6.0 对应放大器
    //首先需要设置成外设功能（除了简单开关/读电平高低以外的功能都叫外设功能）才能使用
    GPIO_setAsPeripheralModuleFunctionInputPin(GPIO_PORT_P6,GPIO_PIN0);

    /* 先初始化ADC12_A整个功能模块，不具体到哪个端口，参数使用默认的先不改
     * 输入参数说明：
     * Base address of ADC12_A Module
     * Use internal ADC12_A bit as sample/hold signal to start conversion
     * USE MODOSC 5MHZ Digital Oscillator as clock source
     * Use default clock divider of 1
     */
    ADC12_A_init(ADC12_A_BASE,
            ADC12_A_SAMPLEHOLDSOURCE_SC,
            ADC12_A_CLOCKSOURCE_ADC12OSC,
            ADC12_A_CLOCKDIVIDER_1);
    //打开ADC12_A功能模块
    ADC12_A_enable(ADC12_A_BASE);

    /* 设置ADC采样时钟，也先保持默认值，与采样速度有关，但采样过快精度会下降
     * 输入参数说明：
     * Base address of ADC12_A Module
     * For memory buffers 0-7 sample/hold for 64 clock cycles
     * For memory buffers 8-15 sample/hold for 4 clock cycles (default)
     * Disable Multiple Sampling
     */
    ADC12_A_setupSamplingTimer(ADC12_A_BASE,
            ADC12_A_CYCLEHOLD_64_CYCLES,
            ADC12_A_CYCLEHOLD_4_CYCLES,
            ADC12_A_MULTIPLESAMPLESDISABLE);

    /* 设置ADC工作端口，以及其对应的内存区域！这里要根据实际接线情况改！
     * 如果要增加，就复制一段这样的代码加在下面，根据实际接线和需求改相应的变量。
     * 输入参数说明：
     * Base address of the ADC12_A Module
     * 使用 memory buffer 0，可以从1~15
     * 绑定 A0 到 memory buffer 0，绑定的MEMORY是随意的，而放大器接的P6.0对应A0
     * 正参考电压Vref+ = AVcc 3.3V
     * 负参考电压Vr- = AVss 0V
     * Memory buffer 0 is not the end of a sequence
     */
    ADC12_A_configureMemoryParam param = {0};
    param.memoryBufferControlIndex = ADC12_A_MEMORY_0;
    param.inputSourceSelect = ADC12_A_INPUT_A0;
    param.positiveRefVoltageSourceSelect = ADC12_A_VREFPOS_AVCC;
    param.negativeRefVoltageSourceSelect = ADC12_A_VREFNEG_AVSS;
    param.endOfSequence = ADC12_A_NOTENDOFSEQUENCE;
    ADC12_A_configureMemory(ADC12_A_BASE ,&param);

    //对MEMORY0配置中断
    ADC12_A_clearInterrupt(ADC12_A_BASE,ADC12IFG0);
    ADC12_A_enableInterrupt(ADC12_A_BASE,ADC12IE0);


}

// ADC中断部分
// 其实也不一定需要用中断来读取ADC值，可以在main的大循环内使用ADC12_A_getResults读取，但在两次读取之间需要加一点延迟让ADC有准备时间！试一下这种方式吧！
// 微秒级别delay可以直接用__delay_cycles(x); x<32768，数据格式决定的
#if defined(__TI_COMPILER_VERSION__) || defined(__IAR_SYSTEMS_ICC__)
#pragma vector=ADC12_VECTOR
__interrupt
#elif defined(__GNUC__)
__attribute__((interrupt(ADC12_VECTOR)))
#endif
void ADC12_A_ISR (void)
{
    // 关闭中断，以免影响运行
    __disable_interrupt();
    // 先读取ADC12IV的值，知道是哪个MEMORY被触发了，这一堆case，查寄存器手册吧
    // 如果要使用多个ADC通道，需要在相应MEMORY的case里加值哟
    switch (__even_in_range(ADC12IV,34)){
        case  0: break;   //Vector  0:  No interrupt
        case  2: break;   //Vector  2:  ADC overflow
        case  4: break;   //Vector  4:  ADC timing overflow
        case  6:          //Vector  6:  ADC12IFG0
            flag=1; // 记录ADC值已经改变
            adcnum1=ADC12_A_getResults(ADC12_A_BASE,ADC12_A_MEMORY_0); //获取特定MEMORY内保存ADC值的函数
            // 读取完ADC值之后就可以写自己的语句实现相应的功能了
                     //set P8.1 On -> LED1
                     if (adcnum1>=682)
                      {
                          ledOff(LED_ALL);
                          ledOn(LED2);
                          if (adcnum1>=1364)
                           {
                               ledOn(LED3);
                               if (adcnum1>=2046)
                               {
                                  ledOn(LED4);
                                  if (adcnum1>=2728)
                                  {
                                      ledOn(LED5);
                                      if (adcnum1>=3480)
                                      {
                                          ledOn(LED6);
                                      }
                                  }
                               }
                           }
                      }
                 else   {
                     ledOff(LED_ALL);
                 }

        case  8: break;   //Vector  8:  ADC12IFG1
        case 10: break;   //Vector 10:  ADC12IFG2
        case 12: break;   //Vector 12:  ADC12IFG3
        case 14: break;   //Vector 14:  ADC12IFG4
        case 16: break;   //Vector 16:  ADC12IFG5
        case 18: break;   //Vector 18:  ADC12IFG6
        case 20: break;   //Vector 20:  ADC12IFG7
        case 22: break;   //Vector 22:  ADC12IFG8
        case 24: break;   //Vector 24:  ADC12IFG9
        case 26: break;   //Vector 26:  ADC12IFG10
        case 28: break;   //Vector 28:  ADC12IFG11
        case 30: break;   //Vector 30:  ADC12IFG12
        case 32: break;   //Vector 32:  ADC12IFG13
        case 34: break;   //Vector 34:  ADC12IFG14
        default: break;
    }
    //执行完之后恢复中断
    __enable_interrupt();
}
```