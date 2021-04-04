---
title: Python编程快速上手（一）猜数字
date: 2019-01-28
category: etc
tags: ["python"]

---
## 程序描述

通过随机函数生成一个范围在1到100之间的随机数，根据用户输入给出正确、大了、小了三种提示，最后输出用户尝试的次数。  
引入了两个NPC——bot1和bot2，bot1的猜数策略是使用二分法，bot2则是随机猜测并且不与之前猜的数字相同。

## 涉及知识点

*   import
*   列表
*   函数

## 代码

```python
import random
num = random.randint(1,100)
passed = False
i = 0

def bot1(num):
    i = 0
    gnum1 = 0
    gnum2 = 100
    while True:
        i = i+1
        gnum = (gnum1+gnum2)//2
        if gnum == num:
            break
        elif gnum > num:
            gnum2 = gnum
        else:
            gnum1 =gnum
    return i

def bot2(num):
    agnum = []
    i = 0
    while True:
        gnum = random.randint(1, 100)
        while not checker(gnum,agnum):
            gnum = random.randint(1,100)
        i = i + 1
        agnum = agnum + [gnum]
        if gnum == num:
            break
    return i

def checker(gnum,agnum):
    if gnum in agnum:
        return False
    else:
        return True

while not passed:
    gnum = int(input())
    i = i + 1
    if gnum == num:
        passed = True
        print("Correct!")
    elif gnum > num:
        print("Wrong Number, Guess Again.")
        print("Tips: Should be smaller.")
    else:
        print("Wrong Number, Guess Again.")
        print("Tips: Should be bigger.")

print("You have tried " + str(i) + " times")
print("Bot1 have tried " + str(bot1(num)) + " times")
print("Bot2 have tried " + str(bot2(num)) + " times")
```
