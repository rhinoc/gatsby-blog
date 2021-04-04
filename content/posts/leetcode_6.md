---
title: LeetCode上的「简单」题（六）121-155
date: 2019-09-05
category: cs
tags: ["leetcode"]

---

## 121 买卖股票的最佳时机

给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。

如果你最多只允许完成一笔交易（即买入和卖出一支股票），设计一个算法来计算你所能获取的最大利润。

注意你不能在买入股票前卖出股票。

示例 1:
```
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
```

示例 2:
```
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```

解一：
> 两次循环。

```js
var maxProfit = function(prices) {
    var period = [];
    var re = 0;
    for (var i=0; i<prices.length;i++){
        period[0] = prices[i];
        for (var j = i+1; j < prices.length; j++) {
            if (prices[j]>period[0]) {
                period[1] = prices[j];
                re = Math.max(re,period[1]-period[0]);
            }
        }
    }
    return re;
};
```

解二：
> 调用内置函数，循环一次的同时寻找右数组中的最大值。

```js
var maxProfit = function (prices) {
    var re = 0;
    for (var i = 0; i < prices.length - 1; i++) {
        var left = prices[i];
        var right = Math.max(...prices.slice(i, prices.length));
        re = Math.max(re, right - left)
    }
    return re
};
```

解三：

> 一次循环。记录最小值并检查当前值与最小值的差值。

```js
var maxProfit = function (prices) {
    var min = prices[0];
    var re = 0;
    for (var i = 1; i < prices.length; i++) {
        if (prices[i] < min) min = prices[i];
        else if (prices[i] - min > re) re = prices[i] - min;
    }
    return re
};
```

##122 买卖股票的最佳时机 II
给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

示例 1:
```
输入: [7,1,5,3,6,4]
输出: 7
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
```

示例 2:
```
输入: [1,2,3,4,5]
输出: 4
解释: 在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。
     因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。
```

示例 3:
```
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```

解：
> 把这道题理解成将一个无序数组分割成若干个有序（从小到大）的子数组就好了。
> 
> 最后计算所有子数组首尾元素差值之和即可。

```js
var maxProfit = function(prices) {
    var period = [prices[0]];
    var re = 0;
    for(var i=1;i<prices.length;i++){
        if (prices[i]<period[period.length-1]) {
            if(period.length>1) re+= period[period.length-1]-period[0];
            period=[prices[i]];
        }
        else period.push(prices[i]);
        if (i===prices.length-1 && period.length)
            re+= period[period.length-1]-period[0];
    }
    return re
};
```

## 125 验证回文串

给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。

说明：本题中，我们将空字符串定义为有效的回文串。

示例 1:
```
输入: "A man, a plan, a canal: Panama"
输出: true
```

示例 2:
```
输入: "race a car"
输出: false
```

解：
> （双指针法）先预处理全部转为小写。然后对左比较点和右比较点赋初值，两边夹逼向内比较，如果遇到非字母和非数字的字符则跳过。

```js
var isPalindrome = function(s) {
    if(!s.length) return true;
    s = s.toLocaleLowerCase();
    var left = {
        item:s[0],
        place:0
    };
    var right = {
        item:s[s.length-1],
        place:s.length-1,
    };
    while(left.place<right.place){
        if(left.item===right.item){
            left.item = s[++left.place];
            right.item = s[--right.place];
        }
        else if(!((left.item>='a'&&left.item<='z')||(left.item>='0'&&left.item<='9'))){
            left.item = s[++left.place];
        }
        else if(!((right.item>='a'&&right.item<='z')||(right.item>='0'&&right.item<='9'))){
            right.item = s[--right.place];
        } else return false;
    }
    return true;
};
```

## 136 只出现一次的数字

给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

说明：你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

示例 1:
```
输入: [2,2,1]
输出: 1
```

示例 2:
```
输入: [4,1,2,1,2]
输出: 4
```

解一：
> 哈希表，遍历一遍`nums`，对于每次遍历的元素，如果其在哈希表中没有映射，则添加进哈希表中；如果有过映射，表示该元素不止出现一次，`delete`删除键值。最后哈希表中只存在一个元素，即为所求。

```js
var singleNumber = function (nums) {
    var map = {};
    for (var num of nums) {
        if (!map[num]) map[num] = 1;
        else delete map[num];
    }
    return Object.keys(map)[0];
};
```

解二：
> 利用数学运算，先获取不重复的数字列表，求和并乘上2，再遍历`nums`，依次减去每次遍历到的元素，最后剩下的就是只出现一次的数字。

```js
var singleNumber = function (nums) {
    var newNums = new Set(nums);
    var sum = 0;
    for (var newNum of newNums) sum += 2 * newNum;
    for (var num of nums) sum -= num;
    return sum;
};
```

解三：

> 利用`XOR`异或。相同元素进行异或操作后结果为0。
> 异或运算的规则如下：
> * $x\oplus0 = x$
> * $x\oplus x = 0$
> * $x\oplus y\oplus x = (x\oplus x)\oplus y = y$

```js
var singleNumber = function (nums) {
    var res = 0;
    for (var num of nums) res ^= num;
    return res;
};
```

## 141 环形链表

给定一个链表，判断链表中是否有环。

为了表示给定链表中的环，我们使用整数`pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果`pos`是`-1`，则在该链表中没有环。


解一：

> 由上到下给每一层遍历到的结点做上标记，如果在下一个结点中出现了这个标记，则表示存在环形结构。如果不想篡改原始数据，可以先用`temp`保存。

```js
var hasCycle = function(head) {
    while(head){
        if (head.val==='rhinoc.top') return true;
        else head.val='rhinoc.top';
        head = head.next;
    }
    return false
};
```

解二：

> 利用`JSON.stringify()`不能字符串化含有循环引用的结构。

```js
var hasCycle = function(head) {
    try{
        JSON.stringify(head);
        return false;
    }
    catch(err){
        return true;
    }
};
```

解三：

> （双指针法）设置一快一慢两个指针，快指针一次走两步到`.next.next`，慢指针一次走一步到`.next`，如果链表不存在环形结构，那么快指针和慢指针不会相遇。如果存在环形结构，快指针总会和慢指针相遇。

```js
var hasCycle = function(head) {
    if(head === null || head.next === null) return false;
    var slow = head;
    var fast = head.next;
    while (slow != fast){
        if (fast === null || fast.next === null) return false;
        slow = slow.next;
        fast = fast.next.next;
    }
    return true;
};
```

## 155 最小栈

设计一个支持 push，pop，top 操作，并能在常数时间内检索到最小元素的栈。

* `push(x)` -- 将元素 x 推入栈中。
* `pop()` -- 删除栈顶的元素。
* `top()` -- 获取栈顶元素。
* `getMin()` -- 检索栈中的最小元素。

解一：

> 用数组保存元素，同时记录当前最小值。不足在于当`pop()`的元素恰好为最小值时要重新`Math.min()`一遍。

```js
var MinStack = function () {
    this.items = [];
    this.min = Infinity;
    return this;
};

MinStack.prototype.push = function (x) {
    this.items.push(x);
    if (x < this.min) this.min = x;
};

MinStack.prototype.pop = function () {
    if (this.items.length) {
        s = this.items.pop();
        if (this.min === s) this.min = Math.min(...this.items);
        return s;
    } else return undefined;
};

MinStack.prototype.top = function () {
    if (this.items.length) {
        return this.items[this.items.length - 1];
    } else return undefined;
};

MinStack.prototype.getMin = function () {
    return this.min;
};
```

解二：

> 双栈，空间换时间，每次`push`保存新的值和新的最小值。类似于Time Machine记录还原点一样。

```js
var MinStack = function () {
    this.items = [];
    this.minStack = [];
    this.count = 0;
    return this;
};

MinStack.prototype.push = function (x) {
    if(!this.count) this.minStack.push(x);
    else if (x < this.minStack[this.count-1]) this.minStack.push(x);
    else this.minStack.push(this.minStack[this.count-1]);
    this.items.push(x);
    this.count++;
};

MinStack.prototype.pop = function () {
    if(!this.count) return undefined;
    this.count--;
    this.minStack.pop();
    return this.items.pop();
};

MinStack.prototype.top = function () {
    if(!this.count) return undefined;
    return this.items[this.count-1];
};

MinStack.prototype.getMin = function () {
    if(!this.count) return undefined;
    return this.minStack[this.count-1];
};
```

