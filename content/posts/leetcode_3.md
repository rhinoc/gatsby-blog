---
title: LeetCode上的「简单」题（三）53-70
date: 2019-08-13
category: cs
tags: ["leetcode"]

---

## 53 最大子序和
给定一个整数数组`nums` ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

示例:
```
输入: [-2,1,-3,4,-1,2,1,-5,4],
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为6。
```

解一（伪）：
> 循环三遍，第一遍确定子序的起点，第二遍确定子序的终点，第三遍确定子序中所有元素的和。由于时间复杂度太高，所以超时。

```js
var maxSubArray = function(nums) {
    var max = nums[0];
    for(var i=0;i<nums.length;i++){
        for (var j=i+1;j<nums.length+1;j++){
            if (nums[j-1]<=0) continue;
            var subArr = nums.slice(i,j);
            var sum = subArr.reduce(function (accumulator,currentValue) {
                return accumulator+currentValue
            })
            if (max < sum ) max = sum;
        }
    }
    return max
};
```

解二（伪）：
> 循环三遍，第一遍确定子序的起点，第二遍确定子序的终点同时计算子序和。速度相比解一有明显提升，然鹅还是超时。

```js
var maxSubArray = function (nums) {
    if (nums.length === 1) return nums[0];
    var max = nums[0];
    for (var i = 0; i < nums.length; i++) {
        var sum = nums[i];
        for (var j = i + 1; j < nums.length; j++) {
            sum += nums[j];
            if (nums[j] <= 0) continue;
            if (max < sum) max = sum;
        }
        if (max < sum) max = sum;
    }
    return max
};
```

解三：
> 循环一遍，`ans`是最终要返回的最大子序和，`sum`存储当前子序和。相比解一解二遍历出所有可能的子序，解三目的明确，就是要找到子序和最大的子序。
> 
> 当`sum <= 0`时，无论下一个`num`正负，都对子序无益，因此重新确定子序`sum = num`。

```js
var maxSubArray = function(nums) {
    var sum = 0;
    var ans = nums[0];
    for(var num of nums) {
        if (sum > 0) sum = sum + num;
        else sum = num;
        ans = Math.max(ans, sum);
    };
    return ans;
};
```
为了更好理解这个过程，以测试用例`[-2, 1, -3, 4, -1, 2, 1, -5, 4]`为例：

![](https://pic.rhinoc.top/mweb/15654201565233.jpg)

```
sum=-2 ans=-2
重新确定子序 => sum=1 ans=1
sum=-2 ans=1
重新确定子序 => sum=4 ans=4
sum=3 ans=4
sum=5 ans=5
sum=6 ans=6
sum=1 ans=6
sum=5 ans=6
```

## 58 最后一个单词的长度

给定一个仅包含大小写字母和空格`' '`的字符串，返回其最后一个单词的长度。
如果不存在最后一个单词，请返回`0`。

说明：一个单词是指由字母组成，但不包含任何空格的字符串。

示例:
```
输入: "Hello World"
输出: 5
```

解一：
> `split`将字符串风格成数组，然后对空格进行处理。

```js
var lengthOfLastWord = function(s) {
    var words = s.split(" ")
    while(words[words.length-1]==='') words.pop()
    if (words.length===0) return 0
    return words[words.length-1].length
};
```

解二：
> 思路和解一差不多，只是将处理空格的步骤放在最前面，并且使用了正则表达式。

```js
var lengthOfLastWord = function(s) {
    s = s.replace(/ *?$/g,'')
    var words = s.split(" ")
    return words[words.length-1].length
};
```

## 66 加一

给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。

最高位数字存放在数组的首位，数组中每个元素只存储单个数字。

你可以假设除了整数 0 之外，这个整数不会以零开头。

示例 1:
```
输入: [1,2,3]
输出: [1,2,4]
解释: 输入数组表示数字 123。
```
示例 2:
```
输入: [4,3,2,1]
输出: [4,3,2,2]
解释: 输入数组表示数字 4321。
```

解一（伪）：
> 将数组转换为数字再加一，然后将数字转换回数组。问题是当数字过大时会造成溢出。

```js
var plusOne = function(digits) {
    var number = 0;
    for(var digit of digits){
        number = number*10 + digit
    }
    number = (++number).toString();
    number = number.split('').map(Number)
    return number
};
```

解二：
> 既然题目已经将数字每一位都分解好了，直接在数组上操作十进制的计算相对更加容易。

```js
var plusOne = function(digits) {
    var len = digits.length;
    for(var i = len-1;i>=0;i--){
        if (digits[i]!=9){
            digits[i]++;
            break;
        }
        else {
            digits[i]=0;
            if (i===0) digits.unshift(1)
        }
    }
    return digits
};
```

## 67 二进制求和

给定两个二进制字符串，返回他们的和（用二进制表示）。
输入为**非空**字符串且只包含数字`1`和`0`。

示例 1:
```
输入: a = "11", b = "1"
输出: "100"
```
示例 2:
```
输入: a = "1010", b = "1011"
输出: "10101"
```

解一（伪）：
> 转换为十进制进行计算，再将结果转换为二进制返回。会产生溢出

```js
var addBinary = function(a, b) {
    a = parseInt(a,2);
    b = parseInt(b,2);
    return (a+b).toString(2)
};
```

解二：
> 将字符串每一位分割入数组保存，先将`a`和`b`数组长度补齐为二者最大长度+1，多出来的一位用来放置进位。计算过程就和小时候笔算十进制一样，本位相加，超出则进位。最后若首位为`0`则削去首位。

```js
var addBinary = function(a, b) {
    function add(x,y) {
        if (x) return (x+y);
        else return y
    }
    a = a.split('').map(Number);
    b = b.split('').map(Number);
    var len = Math.max(a.length,b.length)+1;
    while(a.length!==len) a.unshift(0);
    while(b.length!==len) b.unshift(0);
    var c = [];
    for (var i=len-1;i>=0;i--){
        c[i] = add(c[i],a[i]+b[i]);
        if (c[i]>1) {
            c[i-1]=add(c[i-1],1);
            c[i]=c[i]-2;
        }
    }
    if (!c[0]) c.shift();
    c = c.join('');
    return c;
};
```
![](https://pic.rhinoc.top/mweb/15656272557363.jpg)

解三：
> 解二的速度很快，但内存消耗很大。解三在解二的基础上省略了一开始字符串和数组的转换，也利用JavaScript弱类型的特性省去了数字和字符的转换。

```js
var addBinary = function (a, b) {
    var len = Math.max(a.length, b.length) + 1;
    while (a.length !== len) a = '0' + a;
    while (b.length !== len) b = '0' + b;
    var c = [];
    for (var i = len - 1; i >= 0; i--) {
        c[i] = c[i] ? c[i] + (a[i] - 0) + (b[i] - 0) : (a[i] - 0) + (b[i] - 0);
        if (c[i] > 1) {
            c[i - 1] = c[i - 1] ? c[i - 1] + 1 : 1;
            c[i] = c[i] - 2;
        }
    }
    if (!c[0]) c.shift();
    return c.join('');
};
```
![](https://pic.rhinoc.top/mweb/15656298078866.jpg)

## 69 x的平方根
实现`int sqrt(int x)`函数。
计算并返回 x 的平方根，其中 x 是非负整数。
由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。

示例 1:
```
输入: 4
输出: 2
```
示例 2:
```
输入: 8
输出: 2
说明: 8 的平方根是 2.82842..., 
     由于返回类型是整数，小数部分将被舍去。
```

解一：
> 现成的`sqrt`函数来一个。

```js
var mySqrt = function(x) {
    return parseInt(Math.sqrt(x));
};
```
![](https://pic.rhinoc.top/mweb/15656300054609.jpg)

解二：
> 最耿直的自增暴力解。

```js
var mySqrt = function(x) {
    var re = 0;
    while(!(re*re<=x&&(re+1)*(re+1)>x)){
        re++;
    }
    return re
};
```
![](https://pic.rhinoc.top/mweb/15656304990251.jpg)

解三：
> 牛顿法，只用知道迭代公式就好了（原理在数学规划课上学得差不多了）：$re_{n+1}=re_{n}-\frac{f(re_n)}{f'(re_n)}$，在本题中：$f(re_n)=re^2-x$、$f'{re_n}=2\times re$

```js
var mySqrt = function(x) {
    if (x===0) return 0;
    var re = 1;
    while(!(re*re<=x&&(re+1)*(re+1)>x)){
        re = parseInt(re-(re*re-x)/(2*re))
    }
    return re
};
```
![](https://pic.rhinoc.top/mweb/15656313070557.jpg)

## 70 爬楼梯
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

[[danger]]
|给定 n 是一个正整数。

示例 1：
```
输入： 2
输出： 2
解释： 有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶
```
示例 2：
```
输入： 3
输出： 3
解释： 有三种方法可以爬到楼顶。
1.  1 阶 + 1 阶 + 1 阶
2.  1 阶 + 2 阶
3.  2 阶 + 1 阶
```

解一（伪）：
> 暴力递归（超时）。

```js
var climbStairs = function (n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    return climbStairs(n - 1) + climbStairs(n - 2);
};
```

解二：
> 同样是暴力递归，但是避免重复计算，边递归的时候边保存备用。

```js
var climbStairs = function (n,map={1:1,2:2}) {
    if (map[n]) return map[n];
    else map[n]=map[n-1]+map[n-2];
    return climbStairs(n - 1,map) + climbStairs(n - 2,map);
};
```
![](https://pic.rhinoc.top/mweb/15656331963887.jpg)

解三：
> 竟然就是斐波那契数列，套公式。

```js
var climbStairs = function(n) {
    const sqrt_5 = Math.sqrt(5);
    const fib_n = Math.pow((1 + sqrt_5) / 2, n + 1) - Math.pow((1 - sqrt_5) / 2,n + 1);
    return Math.round(fib_n / sqrt_5);
};
```
![](https://pic.rhinoc.top/mweb/15656332229095.jpg)




