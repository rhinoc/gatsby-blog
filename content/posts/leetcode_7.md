---
title: LeetCode上的「简单」题（七）160-172
date: 2019-09-07
category: cs
tags: ["leetcode"]

---
## 160 相交链表

编写一个程序，找到两个单链表相交的起始节点。
* 如果两个链表没有交点，返回`null`.
* 在返回结果后，两个链表仍须保持原有的结构。
* 可假定整个链表结构中没有循环。
* 程序尽量满足$O(n)$时间复杂度，且仅用$O(1)$内存。

解一：
> 先遍历`headA`并打上标记，再遍历`headB`寻找标记。

```js
var getIntersectionNode = function(headA, headB) {
    while(headA){
        headA.sep = 1;
        headA = headA.next;
    }
    while(headB){
        if(headB.sep) return headB
        headB = headB.next;
    }
};
```

解二：
> 嵌套循环。

```js
var getIntersectionNode = function(headA, headB) {
    while(headA){
        var temp = headB;
        while(temp){
            if(temp===headA) return headA;
            temp=temp.next
        }
        headA=headA.next;
    }
};
```

解三：
> 双指针法。初始化两个指针`pA`和`pB`分别指向`headA`和`headB`，每次`pA`和`pB`各走一步，当`pA`触底后变轨到`headB`，同理，当`pB`触底后变轨到`headA`。这样就只需遍历`A的非公共部分`+`B的非公共部分`+`AB的公共部分`。
> 
> 我画了一张图，方便理解：
> ![](https://pic.rhinoc.top/mweb/15678195698115.jpg)


```js
var getIntersectionNode = function(headA, headB) {
    var pA = headA;
    var pB = headB;
    while(pA !== pB){
        pB = pB? pB.next: headA;
        pA = pA? pA.next: headB;
    }
    return pA;
};
```
![](https://pic.rhinoc.top/mweb/15678183827238.jpg)

## 167 两数之和 II - 输入有序数组

给定一个已按照升序排列 的有序数组，找到两个数使得它们相加之和等于目标数。

函数应该返回这两个下标值 index1 和 index2，其中 index1 必须小于 index2。

说明:
* 返回的下标值（index1 和 index2）从1开始的。
* 你可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。

示例:
```
输入: numbers = [2, 7, 11, 15], target = 9
输出: [1,2]
解释: 2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。
```

解一：

> 常规解法可以参考[1 两数之和](https://rhinoc.top/leetcode_1/#1-%E4%B8%A4%E6%95%B0%E4%B9%8B%E5%92%8C)。
> 
> 这道两数之和II在I的基础上增加了一个「数组升序排列」的条件，因此想让代码和I区分开来，主要该关注如何利用好这个新增条件。
> 
> 这里使用双指针法，一头一尾向中间逼近，当头和尾的值之和为目标值时跳出循环返回结果。
> 
> 设`A=numbers[pA]`，`B=numbers[pB]`，当`A+B=target`时我们返回`pA`和`pB`。但是如果不等于时该如何处理，对谁处理呢？比如当`A+B>target`，究竟要减小`A`（左移`pA`）还是减小`B`（左移`pB`）呢？
> 
> 假设$[...,a,b,c,...,d,e,f,…]$是已经升序排列的输入数组，并且元素$b$, $e$是唯一解。只要**从左到右移动较小指针，从右到左移动较大指针，一次只移动一个指针**，总有某个时刻存在一个指针移动到$b$或$e$的位置。不妨假设小指针先移动到了元素$b$，这时两个元素的和一定比目标值大，根据算法，我们会向左移动较大指针直至获得结果。

```js
var twoSum = function(numbers, target) {
  var pA = 0;
  var pB = numbers.length-1;
  var sum = numbers[pA]+numbers[pB];
  while(sum!==target){
    if (sum<target) pA++;
    else pB--;
    sum = numbers[pA]+numbers[pB];
  }
  return [pA+1,pB+1];
};
```

解二：

> 既然是有序数组，我们当然也可以利用二分法进行查找。
> 
> 二分法相关算法可以看[35 搜索插入位置](https://www.rhinoc.top/leetcode_2/#35-%E6%90%9C%E7%B4%A2%E6%8F%92%E5%85%A5%E4%BD%8D%E7%BD%AE)。

```js
var twoSum = function (numbers, target) {
    var right = numbers.length - 1;
    for (var i = 0; i <= right; i++) {
        var re = binarySearch(numbers, i + 1, right, target - numbers[i]);
        if (re !== -1) return [i + 1, re + 1];
    }
};

const binarySearch = function (arr, left, right, target) {
    while (left < right) {
        var pos = parseInt((left + right) >>> 1);
        if (arr[pos] < target) left = pos+1;
        else right = pos;
    }
    if(arr[left]===target) return left
    else return -1;
};
```

## 168 Excel表列名称

给定一个正整数，返回它在 Excel 表中相对应的列名称。

例如，
```
    1 -> A
    2 -> B
    3 -> C
    ...
    26 -> Z
    27 -> AA
    28 -> AB 
    ...
```

解：
> 这道题难点在于理解中间的转换。乍一看像是普通的进制转换，以为按照26进制转换就行了，但是实际写代码，就发现这个奇特的进制里没有`0`，不仅数字是从`A`(1)开始的，进位之后也没有`0`的存在，`Z`(26)进位后直接就是`AA`(27)。类比到十进制，就是`9`进位后不是`10`了，是`11`。
> 
> 这样的话，我们想用常规的求余数再倒序进行转换就不行了，因为总有诸如`26%26=0`的情况会造成操作异常。
> 
> 所以呢，需要每次循环来一个`n=n-1`的操作。

```js
var convertToTitle = function(n) {
    var re =[];
    while(n>0){
        n --;
        re.unshift(String.fromCharCode(65+n%26));
        n = parseInt(n/26);
    }
    return re.join('')
};
```

## 169 求众数

给定一个大小为n的数组，找到其中的众数。众数是指在数组中出现次数大于`n/2`的元素。

你可以假设数组是非空的，并且给定的数组总是存在众数。

示例 1:
```
输入: [3,2,3]
输出: 3
```

示例 2:
```
输入: [2,2,1,1,1,2,2]
输出: 2
```

解一：
> 两次循环，第一次用对象类型进行计数，第二次找出对象中计数最大项。

```js
var majorityElement = function(nums) {
    var map = {};
    for (var item of nums){
        if (map[item]!==undefined) map[item]++;
        else map[item] = 0;
    }
    var re = nums[0];
    for (var item in map){
        if (map[re]<map[item]) re = item;
    }
    return re;

};
```

解二：
> 一次循环，计数的同时记录当前计数最大项。

```js
var majorityElement = function(nums) {
    var map = {};
    var re = nums[0];
    for (var item of nums){
        if (map[item]!==undefined) map[item]++;
        else map[item] = 1;
        if (map[re]<map[item]) re = item;
    }
    return re;
};
```

解三：
> 题目中限定众数的出现次数大于n/2，所以当计数大于n/2时直接返回。

```js
var majorityElement = function (nums) {
    var map = {};
    for (var item of nums) {
        if (map[item]==null) map[item]=0;
        if (2 * ++map[item] > nums.length) return item;
    }
};
```

解四：
> 先排序，然后返回下标为n/2的元素。

```js
var majorityElement = function (nums) {
    nums = nums.sort((a,b)=> a-b);
    return nums[parseInt(nums.length/2)]
};
```

解五：
> 摩尔投票法。如果我们把众数记为 +1 ，把其他数记为 -1 ，将它们全部加起来，显然和大于 0 ，从结果本身我们可以看出众数比其他数多。

```js
var majorityElement = function (nums) {
    var count = 0;
    var re = null;
    for (var item of nums){
        if (count===0) re = item;
        count += item===re? 1 : -1;
    }
    return re;
};
```
![](https://pic.rhinoc.top/mweb/15681833604614.jpg)

## 171 Excel表列序号

这道题是[168 Excel表列名称](#168-Excel表列名称)的逆向题。

给定一个Excel表格中的列名称，返回其相应的列序号。

例如：
```
    A -> 1
    B -> 2
    C -> 3
    ...
    Z -> 26
    AA -> 27
    AB -> 28 
    ...
```

解：
```js
var titleToNumber = function (s) {
    var sum = 0;
    s = s.split('');
    for (var i = 0; i < s.length; i++)
        sum = sum * 26 + s[i].charCodeAt() - 64;
    return sum;
}
```

## 172 阶乘后的零

给定一个整数 n，返回 n! 结果尾数中零的数量。

示例 1:
```
输入: 3
输出: 0
解释: 3! = 6, 尾数中没有零。
```

示例 2:
```
输入: 5
输出: 1
解释: 5! = 120, 尾数中有 1 个零.
```

解：
> 这是一道数学题。
> 
> 然后我们观察一下，5 的阶乘结果是 120，零的个数为 1：`5! = 5 * 4 * 3 * 2 * 1 = 120`。
> 
> 末尾唯一的零来自于 2 * 5。很显然，如果需要产生零，阶乘中的数需要包含 2 和 5 这两个因子。
> 
> 例如：`4 * 10 = 40` 也会产生零，因为 `4 * 10 = ( 2 * 2 ) * ( 2 * 5)` 。
> 
> 因此，我们只要数一数组成阶乘的数中共有多少对 2 和 5 的组合即可。**又因为 5 的个数一定比 2 少**，问题简化为计算 5 的个数就可以了。

```js
var trailingZeroes = function(n) {
    var res = 0;
    while (n>=5){
        n = parseInt(n/5); //下一次的数
        res += n; //这一次包含多少个5
    }
    return res;
};
```