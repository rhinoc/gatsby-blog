---
title: Arduino基础（二）模拟输出和输入
date: 2018-10-25
category: embeded
tags: ["arduino"]
---

## 硬件介绍
![](https://pic.rhinoc.top/15404750934298.jpg)  
电位器两端一端接电源一端接地，哪一端接地是无所谓的，只决定是顺时针还是逆时针转电压的变化。中间一端接Arduino的模拟输入引脚（A0～A5）。

> 关于模拟输出，引脚数字边上有波浪线`～`的代表支持模拟输出。

## 连接示意图

![](https://pic.rhinoc.top/15404752321643.jpg)

## 代码

```c
#define LED 11

int readVal = 0;
int ledVal = 0;

void setup() {
  // put your setup code here, to run once:
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
}

void loop() { // put your main code here, to run repeatedly:
  readVal = analogRead(A0);
  ledVal = map(readVal, 0, 1024, 0, 255);
  Serial.println(readVal);
  analogWrite(LED, ledVal);
}  
```

## 问题以及解决方法

旋转到亮度较大的时候很大一段亮度没有发生变化。这是因为LED灯的亮度变化数值范围是在[0,255]（8个bit）而模拟输入是在[0,1023]（10个bit），所以当电位器旋转超过255时，亮度没有变化。  
解决方法也很简单，只用把[0,1023]映射到[0,255]。即代码中的`map(readVal, 0, 1024, 0, 255);`。

## 成果演示

![](https://pic.rhinoc.top/20181025215600.gif)

## 小小的拓展——呼吸灯

### 代码

```c
#define LED 11

int readVal = 0;
int ledVal = 0;
int increment = 10;

void setup() {
  // put your setup code here, to run once:
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
}
void loop() { // put your main code here, to run repeatedly:
  readVal += increment;
  ledVal = map(readVal, 0, 1024, 0, 255);
  Serial.println(ledVal);
  analogWrite(LED, ledVal);
  delay(50);
  if (ledVal >= 250) increment = -10;
  else if (ledVal <=5) increment = 10;
}
```

### 成果演示

![](https://pic.rhinoc.top/soogif1%202.gif)