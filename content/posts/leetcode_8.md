---
title: LeetCode上的「简单」题（八）189-203
date: 2019-09-14
category: cs
tags: ["leetcode"]

---

## 189 旋转数组

给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。

示例 1:
```
输入: [1,2,3,4,5,6,7] 和 k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右旋转 1 步: [7,1,2,3,4,5,6]
向右旋转 2 步: [6,7,1,2,3,4,5]
向右旋转 3 步: [5,6,7,1,2,3,4]
```
示例 2:
```
输入: [-1,-100,3,99] 和 k = 2
输出: [3,99,-1,-100]
解释: 
向右旋转 1 步: [99,-1,-100,3]
向右旋转 2 步: [3,99,-1,-100]
```
说明:
* 尽可能想出更多的解决方案，至少有三种不同的方法可以解决这个问题。
* 要求使用空间复杂度为 O(1) 的 **原地**算法。

解一：
> 数组拼接。

```js
var len = nums.length;
    k = k%len;
    var newNums = nums.concat(nums);
    newNums = newNums.slice(len-k,2*len-k);
    for (var i=0;i<len;i++){
        nums[i]=newNums[i];
    }
    return nums
```

解二：
> 每次右移1位，移k次。

```js
var rotate = function(nums, k) {
    for(var i=0;i<k;i++){
        var temp = nums[nums.length-1];
        for (var j=0; j<nums.length; j++){
            var tmp = nums[j];
            nums[j] = temp;
            temp = tmp;
        }
    }
    return nums
};
```

解三：
> 从位置0开始移，每次移动k个位置，移动后计算下一个位置。

```js
var rotate = function (nums, k) {
    k %= nums.length;
    if (k) {
        var len = nums.length;
        var start = 0; //开始位置
        var i = 0; //当前位置
        var temp = nums[len - k]; //当前位置的新值
        var count = 0; //已经操作了多少个元素，作为判断是否继续循环的条件

        while (count !== len) {
            var tmp = nums[i]; //保存当前位置的初始值，之后赋给temp
            nums[i] = temp; //将当前位置赋予新值
            temp = tmp; 
            i = (i + k) % len; //计算下个位置
            if (i === start) { //如果下个位置又回到起点
                i = ++start; 
                temp = nums[len - k + start]
            }
            count++;
        }
    }
    return nums
};
```

解四：
> 数组反转。第一次整体反转，第二次反转左边k个元素，第三次反转右边剩余元素。

```js
var rotate = function (nums, k) {
    var len = nums.length;
    k %= len;
    const reverse = function (arr,start,end) {
        while(start<end){
            var temp = arr[start];
            nums[start++]=nums[end];
            nums[end--]=temp;
        }
    };

    reverse(nums,0,len-1);
    reverse(nums,0,k-1);
    reverse(nums,k,len-1)

    return nums;
};
```

## 190 颠倒二进制位

颠倒给定的 32 位无符号整数的二进制位。

示例 1：
```
输入: 00000010100101000001111010011100
输出: 00111001011110000010100101000000
解释: 输入的二进制串 00000010100101000001111010011100 表示无符号整数 43261596，
      因此返回 964176192，其二进制表示形式为 00111001011110000010100101000000。
```

示例 2：
```
输入：11111111111111111111111111111101
输出：10111111111111111111111111111111
解释：输入的二进制串 11111111111111111111111111111101 表示无符号整数 4294967293，
      因此返回 3221225471 其二进制表示形式为 10101111110010110010011101101001。
```

提示：
* 请注意，在某些语言（如 Java）中，没有无符号整数类型。在这种情况下，输入和输出都将被指定为有符号整数类型，并且不应影响您的实现，因为无论整数是有符号的还是无符号的，其内部的二进制表示形式都是相同的。
* 在 Java 中，编译器使用二进制补码记法来表示有符号整数。因此，在上面的 示例 2 中，输入表示有符号整数 -3，输出表示有符号整数 -1073741825。

解一：
> 使用JavaScript内置的`toString`和`parseInt`进行进制转换。
> 整个过程的流程：`十进制数字->二进制字符串->二进制数组->首位补0->二进制数组反转->二进制字符串->十进制数字`

```js
var reverseBits = function(n) {
    n = n.toString(2);
    n = n.split('')

    while(n.length<32){
        n.unshift('0')
    }

    var start = 0;
    var end = 31;

    while(start<end){
        var temp = n[start];
        n[start++]=n[end];
        n[end--]=temp;
    }

    return parseInt(n.join(''),2)
};
```

解二：
> 手动进制转换。
> 整个过程的流程：`十进制数字->二进制数组->首位补0->十进制数字`
> 因为十进制转二进制是逐次求余再倒序拼接余数，这里我们可以直接利用数组的下标和位数呈互补关系进行进制转换，不需要再倒序。

```js
var reverseBits = function(n) {
    var bin = [];
    while (n){
        bin.unshift(n%2);
        n = parseInt(n/2);
    }
    while (bin.length<32) bin.unshift(0);
    
    var re = 0;
    for (var i=0; i<32; i++){
        re += bin[i]*Math.pow(2,i);
    }
    return re;
};
```

解三：
> 在解二的基础上进行简化，去掉了保存每一位和补0的过程，直接在循环中进行累加。

```js
var reverseBits = function(n) {
    var re = 0;
    var count = 0;
    while (n){
        re += (n%2)*Math.pow(2,32-++count);
        n = parseInt(n/2);
    }
    return re;
};
```
![](https://pic.rhinoc.top/mweb/15684343917582.jpg)

## 191 位1的个数

编写一个函数，输入是一个无符号整数，返回其二进制表达式中数字位数为 ‘1’ 的个数（也被称为汉明重量）。

示例 1：
```
输入：00000000000000000000000000001011
输出：3
解释：输入的二进制串 00000000000000000000000000001011 中，共有三位为 '1'。
```
示例 2：
```
输入：00000000000000000000000010000000
输出：1
解释：输入的二进制串 00000000000000000000000010000000 中，共有一位为 '1'。
```
示例 3：
```
输入：11111111111111111111111111111101
输出：31
解释：输入的二进制串 11111111111111111111111111111101 中，共有 31 位为 '1'。
```

提示：
* 请注意，在某些语言（如 Java）中，没有无符号整数类型。在这种情况下，输入和输出都将被指定为有符号整数类型，并且不应影响您的实现，因为无论整数是有符号的还是无符号的，其内部的二进制表示形式都是相同的。
* 在 Java 中，编译器使用二进制补码记法来表示有符号整数。因此，在上面的 示例 3 中，输入表示有符号整数 -3。


解一：
> 先`toString`转换为二进制字符串，再`split`成数组，最后逐位对比是否为1。

```js
var hammingWeight = function(n) {
    n = n.toString(2).split('');
    var count = 0;
    for (var item of n){
        if (item==1) count++;
    }
    return count
};
```

解二：
> 逐位取余，若余数为1则计数加一。

```js
var hammingWeight = function(n) {
    var count = 0;
    while(n){
        if (n%2) count++;
        n = parseInt(n/2);
    }
    return count
};
```

解三：
> 我们不再检查数字的每一个位，而是不断把数字最后一个 1 反转，并把答案加一。当数字变成 0 的时候，我们就知道它没有 1 了，此时返回答案。
> 
> 这里关键的想法是对于任意数字 n ，将 n 和 n−1 做与运算，会把最后一个 1 的位变成 0。
> ![](https://pic.rhinoc.top/mweb/15684426127285.jpg)


```js
var hammingWeight = function(n) {
    var count = 0;
    while(n){
        count++;
        n &= (n-1);
    }
    return count
};
```

## 198 打家劫舍

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，**如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警**。

给定一个代表每个房屋存放金额的非负整数数组，计算你在**不触动警报装置的情况下**，能够偷窃到的最高金额。

示例 1:
```
输入: [1,2,3,1]
输出: 4
解释: 偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。
```

示例 2:
```
输入: [2,7,9,3,1]
输出: 12
解释: 偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
```

解一：
> 第一感觉就是用递归，因为设计很多重复运算，所以用`map`保存每次运算的结果。
> 
> 有一个坑就是我之前为了写着方便就用`add1 = map[next1]||rob(next1,map)`，所以在最后一个用例（nums为100个0组成的数组）栽了跟头。

```js
var rob = function (nums, map = {}) {
    var len = nums.length;
    
    if (len === 0) return 0;
    if (len === 1) return nums[0];
    if (len === 2) return Math.max(nums[0], nums[1]);
    
    var next1 = nums.slice(2, len);
    var next2 = nums.slice(3, len);
    var add1 = map[next1] != null ? map[next1] : rob(next1, map);
    var add2 = map[next2] != null ? map[next2] : rob(next2, map);
    var re = Math.max(nums[0] + add1, nums[1] + add2);
    map[nums] = re;
    return re;
};
```

解二：
> 动态规划。
> 
> 设$f(k)=从前 k 个房屋中能抢劫到的最大数额$，$A_i=第i个房屋的钱数$，那么我们可以递推出如下规律：
> * $n=0，f(0)=0$
> * $f(1)=1$
> * $f(2)=\max(A_1,A_2)$
> * $f(3)=\max(f(1)+A_3, f(2))$
> 
> 总结出公式：$f(k)=\max(f(k-2)+A_k, f(k-1))$

```js
var rob = function(nums) {
    var prev = 0; //f(k-1)
    var ans = 0;

    for (var num of nums){
        var temp = ans;
        ans = Math.max(prev+num, ans); //f(k)
        prev = temp;
    }
    return ans
};
```

## 202 快乐数

编写一个算法来判断一个数是不是“快乐数”。

一个“快乐数”定义为：对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和，然后重复这个过程直到这个数变为 1，也可能是无限循环但始终变不到 1。如果可以变为 1，那么这个数就是快乐数。

示例: 
```
输入: 19
输出: true
解释: 
12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1
```

解一：
> 用`map`存储遍历过的值。

```js
var isHappy = function(n) {
    var map = {};
    
    const getSum = function (n) {
        var sum = 0;
        while(n){
            sum+=Math.pow(n%10,2);
            n=parseInt(n/10)
        }
        return sum;
    };

    while(1){
        var sum = getSum(n);
        if (sum===1) return true;
        else if (map[sum]) return false;
        else {
            n=sum;
            map[sum] = 1;
        }
    }
};
```

解二：
> 用快指针和慢指针。

```js
var isHappy = function(n) {
    const getSum = function (n) {
        var sum = 0;
        while(n){
            sum+=(n%10)*(n%10);
            n=parseInt(n/10)
        }
        return sum;
    };

    var slow = n;
    var fast = getSum(n);
    
    while(slow!==fast){
        slow = getSum(slow);
        fast = getSum(getSum(fast));
    }

    return slow===1
};
```

## 203 移除链表元素

删除链表中等于给定值 val 的所有结点。

示例:
```
输入: 1->2->6->3->4->5->6, val = 6
输出: 1->2->3->4->5
```

解一：
> 删除节点其实就是将上一个结点的`next`跳过值为`val`的节点连接到下一个结点。
> 要注意的是，由于链表的特性，最后返回的应该是链表的头部，所以我们要先对链表头部进行操作，确保第一个结点的值不是`val`。然后将这个节点保存下来用来返回。

```js
var removeElements = function(head, val) {
    while(head && head.val===val) head = head.next;
    var first = head;
    
    while(head){
        if (head.next && head.next.val===val) head.next = head.next.next;
        else head = head.next;
    }
    return first;
};
```

解二：
> 递归。

```js
var removeElements = function (head, val) {
    if (!head) return null;
    head.next = removeElements(head.next, val);
    if (head.val === val) return head.next;
    else return head;
}
```