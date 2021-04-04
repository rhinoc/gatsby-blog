---
title: Arduino基础（四）串口通信与PWM
date: 2018-10-30
category: embeded
tags: ["arduino"]

---


## 串口通信与调试

以光敏电阻模拟输出为例引入串口通信与调试。

### 硬件介绍

![](https://pic.rhinoc.top/15408959997750.jpg)  
![](https://pic.rhinoc.top/15408963410285.jpg)  
左边的是光强-阻值关系曲线，右边是环境温度-阻值关系曲线。可以看出，当光照越强，阻值越小，<del>而且基本是呈线性变化的</del>。（注意纵坐标是指数级增加）

### 连线图

![](https://pic.rhinoc.top/Untitled Sketch_bb.png)

### 代码

```c
#define LED 13
#define LDR A5

int Intensity = 0;

void setup()
{
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  Intensity = analogRead(LDR);
  Serial.println(Intensity);
  delay(1000);
}
```

### 串口监视器

![](https://pic.rhinoc.top/15408966602871.jpg)

### 串口绘图器

要绘图的话，串口输出必须是一系列数值，这就要求使用`Serial.println`。  
![](https://pic.rhinoc.top/15408965459403.jpg)  
除了自带绘图器之外，Arduino还支持FlexiPlot、PlotPlus等其他绘图软件，只需要在`管理库`中下载对应的库函数即可调用。

### 滤波

通过模数转换得到的值都应该通过滤波得到一个稳定可靠的值。即记录若干个读进来的数据然后求平均。  

```c
#define LED 13
#define LDR A5

int Intensity[10];

void setup()
{
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  int averi = 0;
  for (int i = 0;i<10;i++)
  {
    Intensity[i] = analogRead(LDR);
    averi += Intensity[i];
    delay(1);
  }
  averi /= 10;
  Serial.println(averi);
}
```

滤波后较为圆滑的曲线。  
![](https://pic.rhinoc.top/15408979953135.jpg)

### 串口输入

值得注意的是，串口输入接收到的数据是`char`类型，也就是说，当我`int a = Serial.read();`时，得到的是输入内容的ASCII码。所以如果要实现串口输入一个数字作为变量保存的话，<del>还需要额外的代码进行处理，思路大致是输入保存为数组然后分位数保存，再处理一下进位和类型转换</del> 可以使用`Serial.parseInt()`。  
有关串口输入还需要设置好对换行符的通信，当设置为`No Line ending`时，不会读入回车。  
这里我只是简单地在之前的代码上加上了一个开关功能。  

```c
\\输入a或b控制  
#define LED 13
#define LDR A5

int Intensity[10];

void setup()
{
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  while(Serial.available()>0)
  {
    int averi = 0;
    char Switch = Serial.read();
    if (Switch == 'b')
    {
      digitalWrite(LED, LOW);
    }
    else
    {
      for (int i = 0;i<10;i++)
     {
       digitalWrite(LED, HIGH);
       Intensity[i] = analogRead(LDR);
       averi += Intensity[i];
       delay(5);
     }
      Serial.println(averi/10);
    }
  }
}
```

```c
\\输入0和1控制
#define LED 13
#define LDR A5

int Intensity[10];

void setup()
{
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  while(Serial.available()>0)
  {
    int averi = 0;
    int Switch = Serial.parseInt();
    if (Switch == 0)
    {
      digitalWrite(LED, LOW);
    }
    else if (Switch == 1)
    {
      for (int i = 0;i<10;i++)
     {
       digitalWrite(LED, HIGH);
       Intensity[i] = analogRead(LDR);
       averi += Intensity[i];
       delay(5);
     }
      Serial.println(averi/10);
    }
    else
    {
      Serial.println("0 or 1, no other choice!");
    }
  }
}
```

## PWM

PWM (**P**ulse **W**idth **M**odulation) 脉冲宽度调制，用于将一段信号编码为占空比不同的脉冲信号（方波信号），让一个周期内的均值作为整体输出，也就是让数字电路实现模拟电路的功能。  
![](https://pic.rhinoc.top/15409006065510.jpg)  
而Arduino中，支持PWM的引脚边上都有`~`，也就是3、5、6、10、11这五个引脚。

### 代码

```c
#define LED 11
#define LDR A5

int Intensity[10];

void setup()
{
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  int x;
  int averi = 0;
  for (int i = 0; i < 10; i++)
  {
    Intensity[i] = analogRead(LDR);
    averi += Intensity[i];
    delay(1);
  }
  averi /= 10;

  x = map(averi, 0, 800, 0, 255); //将当前环境亮度映射到0-255
  //Serial.print("x=");
  //Serial.println(x);
  analogWrite(LED, 255 - x); //环境亮度越亮，LED发出的光越暗
  Serial.println(averi);
}
```

### 演示

![](https://pic.rhinoc.top/soogif1.gif)