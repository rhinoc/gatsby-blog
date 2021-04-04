---
title: Arduino基础（三）半导体测温元件与蜂鸣器
date: 2018-10-28
category: embeded
tags: ["arduino"]

---

## 温度测量

### 硬件介绍

最早感知温度的手段：

*   热敏电阻
*   热电偶

> 原理：测量电阻值带来的电压的变化

现在感知温度的手段：

*   半导体测温元件（LM35）

![](https://pic.rhinoc.top/15407020094953.jpg)

### 问题和解决方案

如何输出当前的摄氏温度？  
![](https://pic.rhinoc.top/15407023291668.jpg)

### 代码

```c
#define LED 13
#define LDR A5

int temperature = 0;
int readVal = 0;
int ledVal = 0;

void setup() {
  // put your setup code here, to run once:
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
}

void loop() { // put your main code here, to run repeatedly:
  temperature = analogRead(LDR);
  Serial.print("temperature = ");
  Serial.println(temperature*0.488);
  delay(500);
}
```

## 蜂鸣器

### 硬件介绍

![](https://pic.rhinoc.top/15407036925119.jpg)

> 蜂鸣器的两根脚有长有短，长的是正极。  
> 表面上贴了一张纸，保护元器件在工业生产中不被清洗水损坏。

实际上，根据驱动方式，蜂鸣器可以分为**有源蜂鸣器**和**无源蜂鸣器**两种，这里的“源”不是指电源，而是指**震荡源**，有源蜂鸣器内部带震荡源，所以只要一通电就会响，而无源内部不带震荡源，仅用直流信号是无法令其鸣叫的，必须用2K-5K的方波去驱动它。而慕课中翁凯老师所说的蜂鸣器指的是有源蜂鸣器，所以当我直接使用视频中的示例代码时，蜂鸣器并不会鸣响。  
![](https://pic.rhinoc.top/mweb/15619934953064.jpg)

*   **无源蜂鸣器**：没有正负之分，类似于喇叭，要在两个腿上加载不同的频率的电信号才可以实现发声，根据不同的频率所发出的声音也是不一样的。
*   **有源蜂鸣器**：有正负之分，只需要在两个腿上加上电压信号就会发声，发出的声音音调单一、频率固定。

### 代码

#### 无源蜂鸣器

对于无源蜂鸣器，必须使用`tone()`函数，通过PWM管脚输出一个波形才能发生。如果用的是`digitalWrite`，会听到轻微的鼓膜震动的嘀嗒声。不过若是使用高低电平交替输出，中间延时时间非常短的情况下，无源蜂鸣器也是可以发声的。  

```c
#define buzzer 3

long frequency = 300;

void setup() {
  // put your setup code here, to run once:
  pinMode(buzzer,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  tone(buzzer, frequency);
  delay(1000);
  noTone(buzzer);
  delay(1000);
}
```

#### 有源蜂鸣器

对于有源蜂鸣器，直接使用`digitalWrite`函数。  

```c
int buzzer = 3;

void setup() {
  pinMode(buzzer, OUTPUT);
}

void loop() {
   digitalWrite(buzzer, HIGH);
   delay(1);

   digitalWrite(buzzer, LOW);
   delay(2);
} 
```

### 小拓展——让蜂鸣器哼歌

如果能控制蜂鸣器发声的频率和时间，就相当于控制了音调和节拍，那么蜂鸣器就能够哼出曲子了。

#### 音调对应表

低音：

<div class="table-container">

<table>

<thead>

<tr>

<th>音符/音调</th>

<th>1̣</th>

<th>2̣</th>

<th>3̣</th>

<th>4̣</th>

<th>5̣</th>

<th>6̣</th>

<th>7̣</th>

</tr>

</thead>

<tbody>

<tr>

<td>A</td>

<td>221</td>

<td>248</td>

<td>278</td>

<td>294</td>

<td>330</td>

<td>371</td>

<td>416</td>

</tr>

<tr>

<td>B</td>

<td>248</td>

<td>278</td>

<td>294</td>

<td>330</td>

<td>371</td>

<td>416</td>

<td>467</td>

</tr>

<tr>

<td>C</td>

<td>131</td>

<td>147</td>

<td>165</td>

<td>175</td>

<td>196</td>

<td>221</td>

<td>248</td>

</tr>

<tr>

<td>D</td>

<td>147</td>

<td>165</td>

<td>175</td>

<td>196</td>

<td>221</td>

<td>248</td>

<td>278</td>

</tr>

<tr>

<td>E</td>

<td>165</td>

<td>175</td>

<td>196</td>

<td>221</td>

<td>248</td>

<td>278</td>

<td>312</td>

</tr>

<tr>

<td>F</td>

<td>175</td>

<td>196</td>

<td>221</td>

<td>234</td>

<td>262</td>

<td>294</td>

<td>330</td>

</tr>

<tr>

<td>G</td>

<td>196</td>

<td>221</td>

<td>234</td>

<td>262</td>

<td>294</td>

<td>330</td>

<td>371</td>

</tr>

</tbody>

</table>

</div>

中音：

<div class="table-container">

<table>

<thead>

<tr>

<th>音符/音调</th>

<th>1</th>

<th>2</th>

<th>3</th>

<th>4</th>

<th>5</th>

<th>6</th>

<th>7</th>

</tr>

</thead>

<tbody>

<tr>

<td>A</td>

<td>441</td>

<td>495</td>

<td>556</td>

<td>589</td>

<td>661</td>

<td>742</td>

<td>833</td>

</tr>

<tr>

<td>B</td>

<td>495</td>

<td>556</td>

<td>624</td>

<td>661</td>

<td>742</td>

<td>833</td>

<td>935</td>

</tr>

<tr>

<td>C</td>

<td>262</td>

<td>294</td>

<td>330</td>

<td>350</td>

<td>393</td>

<td>441</td>

<td>495</td>

</tr>

<tr>

<td>D</td>

<td>294</td>

<td>330</td>

<td>350</td>

<td>393</td>

<td>441</td>

<td>495</td>

<td>556</td>

</tr>

<tr>

<td>E</td>

<td>330</td>

<td>350</td>

<td>393</td>

<td>441</td>

<td>495</td>

<td>556</td>

<td>624</td>

</tr>

<tr>

<td>F</td>

<td>350</td>

<td>393</td>

<td>441</td>

<td>495</td>

<td>556</td>

<td>624</td>

<td>661</td>

</tr>

<tr>

<td>G</td>

<td>393</td>

<td>441</td>

<td>495</td>

<td>556</td>

<td>624</td>

<td>661</td>

<td>742</td>

</tr>

</tbody>

</table>

</div>

高音：

<div class="table-container">

<table>

<thead>

<tr>

<th>音符/音调</th>

<th>1̇</th>

<th>2̇</th>

<th>3̇</th>

<th>4̇</th>

<th>5̇</th>

<th>6̇</th>

<th>7̇</th>

</tr>

</thead>

<tbody>

<tr>

<td>A</td>

<td>882</td>

<td>992</td>

<td>1112</td>

<td>1178</td>

<td>1322</td>

<td>1484</td>

<td>1665</td>

</tr>

<tr>

<td>B</td>

<td>990</td>

<td>1112</td>

<td>1178</td>

<td>1322</td>

<td>1484</td>

<td>1665</td>

<td>1869</td>

</tr>

<tr>

<td>C</td>

<td>525</td>

<td>589</td>

<td>661</td>

<td>700</td>

<td>786</td>

<td>882</td>

<td>990</td>

</tr>

<tr>

<td>D</td>

<td>589</td>

<td>661</td>

<td>700</td>

<td>786</td>

<td>882</td>

<td>990</td>

<td>1112</td>

</tr>

<tr>

<td>E</td>

<td>661</td>

<td>700</td>

<td>786</td>

<td>882</td>

<td>990</td>

<td>1112</td>

<td>1248</td>

</tr>

<tr>

<td>F</td>

<td>700</td>

<td>786</td>

<td>882</td>

<td>935</td>

<td>1049</td>

<td>1178</td>

<td>1322</td>

</tr>

<tr>

<td>G</td>

<td>786</td>

<td>882</td>

<td>990</td>

<td>1049</td>

<td>1178</td>

<td>1322</td>

<td>1484</td>

</tr>

</tbody>

</table>

</div>

那么以赵紫骅的《可乐》这一首歌为例，试试怎么让蜂鸣器哼出“可惜在遇见……太晚了”这一段。

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="330" height="86" src="//music.163.com/outchain/player?type=2&id=29759733&auto=0&height=66"></iframe>

先要了解一下简谱：  
![](https://pic.rhinoc.top/15407092523101.jpg)  
![](https://pic.rhinoc.top/15407093044514.jpg)

从第一张图副标题位置可以看到，这张简谱是F调的，对应表里F调所在行；也可以看到节拍是4/4拍，即每个普通音符对应1拍。

> 普通音符：占1拍 eg. 6  
> 带下划线的音符：占0.5拍 eg. _3_  
> 后面加点的音符：占1.5拍 eg. 3·  
> 后面加横杠的音符：占2拍 eg. 3 -  
> 连续的两个音符上带有弧线：表示连音，稍微将两个音符的频率差减小  
> 上面带小点的音符：高音 eg. 5̇  
> 下面带小点的音符：低音 eg. 7̣

#### 代码

```c
// 中音F调
#define NTF0 -1
#define NTF1 350
#define NTF2 393
#define NTF3 441
#define NTF4 495
#define NTF5 556
#define NTF6 624
#define NTF7 661
// 低音F调
#define NTFL1 175
#define NTFL2 196
#define NTFL3 221
#define NTFL4 234
#define NTFL5 262
#define NTFL6 294
#define NTFL7 330
//高音F调
#define NTFH1 700
#define NTFH2 786
#define NTFH3 882
#define NTFH4 935
#define NTFH5 1049
#define NTFH6 1178
#define NTFH7 1322

int tune[]=
{
  NTF0,NTF0,NTF0,NTF0,NTFL3,NTFL4,
  NTFL5,NTFL3,NTFL5,NTFL3,NTFL5,NTFL3,NTFL5,NTF3,
  NTF2,NTF1,NTFL6,NTFL6,NTFL6,NTF3,
  NTF2,NTF1,NTF2,NTF2,NTFL5,NTFL5,NTFL3,NTFL5,NTF2,
  NTF2,NTFL7,NTFL7,NTFL7,NTF1,NTF1,NTF1,NTF2,NTF3,
  NTF3,NTFL6,NTF2,NTF2,NTF1,NTF2,NTF3,
  NTF3,NTFL5,NTF1,NTF1,NTF1,NTF2,NTF3,
  NTF3,NTFL6,NTFL7,NTF1,NTF1,NTFL7,NTF1,NTF2,
  NTF3,NTF2,NTF2,NTF1,NTFL5,NTF0,NTFL3,NTFL4,
  NTFL5,NTFL3,NTFL5,NTFL3,NTFL5,NTFL3,NTFL5,NTF3,
  NTF2,NTF1,NTFL6,NTFL6,NTFL6,NTF3,
  NTF2,NTF1,NTF2,NTF2,NTFL5,NTFL5,NTFL3,NTFL5,NTF2,
  NTF2,NTF1,NTF2,NTF3,NTF3,NTF3,NTF4,NTF5,
  NTF5,NTF1,NTF2,NTF2,NTF3,NTF4,NTF5,
  NTF5,NTF1,NTF2,NTFL7,NTF1,NTF1,NTF3,NTF4,NTF5,
  NTF5,NTF1,NTF6,NTF6,NTF5,NTF3,NTF3,NTF4,NTF3,NTF3,NTF1,NTF2,
  NTF2,NTF0,NTFL5,NTF6,NTF3,
  NTF3,NTF4,NTF5,NTF0,NTFL5,NTF6,NTF3,
  NTF3,NTF4,NTF3,NTF3,NTF3,NTF3,NTF1,NTF1,NTF7,
  NTF7,NTFH1,NTF7,NTF7,NTF5,NTF5,NTF7,NTFH1,NTF7,NTF7,NTF2,
  NTF3,NTF0,NTF0
};
float durt[]=
{
  1,1,1,0.75,0.25,0.25,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.33,0.33,0.33,2,0.25,0.75,
  0.25,0.25,0.5,0.75,0.25,0.5,0.5,0.25,0.75,
  0.25,0.25,0.5,0.5,0.5,1,0.33,0.33,0.33,
  1,0.5,0.5,1,0.33,0.33,0.33,
  1,0.5,0.5,1,0.33,0.33,0.33,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.25,0.75,0.5,0.5,1,0.5,0.25,0.25,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.33,0.33,0.33,2,0.5,0.5,
  0.5,0.25,0.25,0.75,0.25,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,1,0.5,0.25,0.25,
  1,0.5,0.5,1,0.5,0.25,0.25,
  0.5,0.5,0.5,0.25,0.25,1,0.5,0.25,0.25,
  0.5,0.25,0.25,0.25,0.5,0.25,0.5,0.25,0.25,0.5,0.25,0.25,
  2,0.5,0.5,0.5,0.5,
  0.5,1,0.5,0.5,0.5,0.5,0.5,
  0.5,0.25,0.25,0.5,0.5,1,0.25,0.25,0.5,
  0.25,0.5,0.25,0.25,0.5,0.25,0.25,0.5,0.25,0.75,0.25,
  3,0.5,0.5
};

int length;
int buzzer=3;
int LED=13;

void setup()
{
  pinMode(buzzer,OUTPUT);
  pinMode(LED,OUTPUT);
  length=sizeof(tune)/sizeof(tune[0]);
}

void loop()
{
  for(int x=0;x<length;x++)
  {
    tone(buzzer,tune[x]);
    digitalWrite(LED, HIGH);
    delay(400*durt[x]);
    digitalWrite(LED, LOW);
    delay(100*durt[x]);
    noTone(buzzer);

  }
  delay(2000);
}
```

