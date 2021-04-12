---
title: Arduino基础（六）外部中断、舵机
date: 2018-11-03
category: embeded
tags: ["arduino"]

---


## 外部中断

> 程序运行过程中可能需要监控某件事件的发生，使用**轮询**的方式效率低等待时间长，而使用**中断**方式进行检测可以达到实时监测的效果。  
> 中断程序可以看作是一段独立于主程序之外的程序，中断触发时，主程序会被暂停直到中断程序运行完毕。

![](https://pic.rhinoc.top/15412452327117.jpg)

### 中断引脚、中断编号、中断模式

只有中断信号发生在带有外部功能的引脚上，Arduino才能捕获到中断信号并响应。

<div class="table-container">

<table>

<thead>

<tr>

<th>型号/中断编号</th>

<th>int0</th>

<th>int1</th>

<th>int2</th>

<th>int3</th>

<th>int4</th>

<th>int5</th>

</tr>

</thead>

<tbody>

<tr>

<td>UNO</td>

<td>2</td>

<td>3</td>

<td>-</td>

<td>-</td>

<td>-</td>

<td>-</td>

</tr>

<tr>

<td>MEGA</td>

<td>2</td>

<td>3</td>

<td>21</td>

<td>20</td>

<td>19</td>

<td>18</td>

</tr>

<tr>

<td>Leonardo</td>

<td>3</td>

<td>2</td>

<td>0</td>

<td>1</td>

<td>-</td>

<td>-</td>

</tr>

<tr>

<td>Due</td>

<td>所有</td>

<td>引脚</td>

<td>均可</td>

<td>使用</td>

<td>外部</td>

<td>中断</td>

</tr>

</tbody>

</table>

</div>

<div class="table-container">

<table>

<thead>

<tr>

<th>模式</th>

<th>说明</th>

</tr>

</thead>

<tbody>

<tr>

<td>LOW</td>

<td>低电平触发</td>

</tr>

<tr>

<td>CHANGE</td>

<td>电平变化触发</td>

</tr>

<tr>

<td>RISING</td>

<td>电平升高触发</td>

</tr>

<tr>

<td>FALLING</td>

<td>电平降低触发</td>

</tr>

</tbody>

</table>

</div>

### 中断函数

中断函数就是当中断被触发后要执行的函数，不能带有参数且返回类型为空。  
还需要在`setup()`中使用`attachInterrupt()`函数初始化中断引脚，以开启Arduino外部中断功能。  

```c
attachInterrupt(interrupt, function, mode) //中断开启函数：中断编号 中断函数名 中断模式  
detachInterrupt(interrupt) //中断分离函数：中断编号  
```

### 实验：外部中断按钮控制LED灯

还是使用之前[Arduino基础（一）简单介绍与数字输入和判断](https://www.rhinoc.top/post/arduino_1.html)的线路。  

```c
int pbIn = 0;                  // 定义中断引脚为0，也就是D2引脚
int LED = 13;                // 定义输出指示灯引脚
volatile int state = LOW;      // 定义默认输入状态

void setup()
{                
  // 置ledOut引脚为输出状态
  pinMode(LED, OUTPUT);

  // 监视中断输入引脚的变化
  attachInterrupt(pbIn, Switch, CHANGE);
  Serial.begin(9600);
}

void loop()                     
{
  // 模拟长时间运行的进程或复杂的任务。
  for (int i = 0; i < 100; i++)
  {
    // 什么都不做，等待10毫秒
    delay(1000);
    Serial.println(i); 
  }

}

void Switch()
{
  state = !state;
  digitalWrite(LED, state);
  Serial.print("Switched! state="); 
  Serial.println(state);
  //delay(10000);  
}
```

通过串口输出观察程序运行流程：  
![](https://pic.rhinoc.top/15412524230338.jpg)

也可以看到按键振荡真的很大：  
![](https://pic.rhinoc.top/15412527690445.jpg)  
为了避免震荡，我在`Switch()`函数里面加了`delay`但是似乎作为中断函数，这个延时是不起作用的，因为程序时刻在监视是否满足中断条件，每满足中断条件的时候，触发的新的中断函数就会覆盖之前的中断函数的执行。
