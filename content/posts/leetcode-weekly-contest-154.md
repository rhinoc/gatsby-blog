---
title: LeetCode Weekly Contest #154 题解与总结
date: 2019-09-15
category: cs
tags: ["leetcode"]

---

> 好歹刷了一两个月的题，感觉有点底蕴可以参加周赛了。第一次参赛，守在电脑前等倒计时，还蛮刺激的。
> 
> 鉴于是第一次比赛，结果还算差强人意。
> 
> ![](https://pic.rhinoc.top/mweb/15685212120398.jpg)

## 5189 “气球”的最大数量

给你一个字符串`text`，你需要使用`text`中的字母来拼凑尽可能多的单词 "balloon"（气球）。

字符串`text`中的每个字母最多只能被使用一次。请你返回最多可以拼凑出多少个单词 "balloon"。

示例 1：
```
输入：text = "nlaebolko"
输出：1
```
示例 2：
```
输入：text = "loonbalxballpoon"
输出：2
```
示例 3：
```
输入：text = "leetcode"
输出：0
```

提示：
* $1 \leq text.length \leq 10^4$
* `text`全部由小写英文字母组成

解：
> 签到题，相当简单了。要组成一个`ballon`，需要1个`b`，1个`a`，2个`l`，2个`o`，1个`n`，统计`text`中包含五个字母的数量，返回最小的`数量/需求量`，即为所求。

```js
var maxNumberOfBalloons = function(text) {
    map={
        'b':0,
        'a':0,
        'l':0,
        'o':0,
        'n':0,
    }
    for(var item of text.split('')){
        if(map[item]!=null) map[item]++;
    }
    return parseInt(Math.min(map['b'],map['a'],map['l']/2,map['o']/2,map['n']))
};
```

## 5190 反转每对括号间的字串

给出一个字符串 s（仅含有小写英文字母和括号）。

请你按照从括号内到外的顺序，逐层反转每对匹配括号中的字符串，并返回最终的结果。

注意，您的结果中 不应 包含任何括号。

 

示例 1：
```
输入：s = "(abcd)"
输出："dcba"
```
示例 2：
```
输入：s = "(u(love)i)"
输出："iloveu"
```
示例 3：
```
输入：s = "(ed(et(oc))el)"
输出："leetcode"
```
示例 4：
```
输入：s = "a(bcdefghijkl(mno)p)q"
输出："apmnolkjihgfedcbq"
```

提示：
* $0 \leq s.length \leq 2000$
* `s` 中只有小写英文字母和括号
* 我们确保所有括号都是成对出现的

解一：
> 我是通过正则表达式，循环查找最内层的括号并翻转，直到没有括号存在。

```js
var reverseParentheses = function(s) {
    var pattern=/(.*)(\(.*?\))(.*)/;

    const reverse = function(s){
        s = s.split('');
        s = s.slice(1,s.length-1) //去掉首尾的括号
        var start = 0;
        var end = s.length-1;
        while(start<end){
            var temp = s[start];
            s[start++] = s[end];
            s[end--]=temp;
        }
        return s.join('');
    };

    while(pattern.test(s)){
        s = RegExp.$1+reverse(RegExp.$2)+RegExp.$3;
    }
    return s
};
```

解二：
> 看了一下TOP1的用户的解答，他的思路是从外到内查找括号，用到了递归。
> 
> JavaScript复现如下：

```js
var reverseParentheses = function (s) {
    var ans = "";
    var start = 0;
    var end = 0;
    var count = 0;
    if (typeof s === 'string') s = s.split('');
    while (start < s.length) {
        if (s[end] === '(') count++;
        else if (s[end] === ')') count--;

        if (count === 0) { //当左右括号配对完或者没有遇到括号
            if (start === end) {//表示没有遇到括号
                ans += s[end]; //ans增加当前字符
                start++; //左指针右移
            } else { //当左右括号配对完成
                ans += reverseParentheses(s.slice(start + 1, end).reverse()); //ans增加括号内反转后的字符串
                start = end + 1; //处理完左部分，再处理右部分，用来处理"a(bc)d(ef)g"这种情况
            }
        }
        end++; //当左右括号尚未配对完，右指针右移，寻找下一个右括号
    }
    return ans
};
```

## 5191 K次串联后最大子数组之和

给你一个整数数组 arr 和一个整数 k。

首先，我们要对该数组进行修改，即把原数组 arr 重复 k 次。

> 举个例子，如果 arr = [1, 2] 且 k = 3，那么修改后的数组就是 [1, 2, 1, 2, 1, 2]。

然后，请你返回修改后的数组中的最大的子数组之和。

注意，子数组长度可以是`0`，在这种情况下它的总和也是`0`。

由于结果可能会很大，所以需要模（mod）`10^9 + 7` 后再返回。 

示例 1：
```
输入：arr = [1,2], k = 3
输出：9
```
示例 2：
```
输入：arr = [1,-2,1], k = 5
输出：2
```
示例 3：
```
输入：arr = [-1,-2], k = 7
输出：0
```

提示：
* $1 \leq arr.length \leq 10^5$
* $1 \leq k \leq 10^5$
* $-10^4 \leq arr[i] \leq 10^4$

解：
> 使用了[53 最大子序和](https://www.rhinoc.top/leetcode_3/#53-%E6%9C%80%E5%A4%A7%E5%AD%90%E5%BA%8F%E5%92%8C)中的`maxSubArray`函数。
> 
> 一开始我的思路是先拼接数组再用`maxSubArray`计算，但是当循环次数非常大的时候会导致内存溢出。
> 
> 所以问题在于要如何利用好**数组是经过k次循环后的**这个条件。
> 
> 在这道题我提交了四次，前三次的错误给了我很好的测试用例的机会。我发现存在这几种可优化的情况：
> 分别计算1个、2个、3个`arr`的最大子数组之和，记为`re1`、`re2`、`re3`
> 1. 当`re1=re2`时，无论重复多少次`arr`，结果都是`re1`
> 2. 当`re2=re3`时，无论重复多少次`arr`，结果都是`re2`
> 3. 当`re1*2=re2`并且`re1*3=re3`时，通用结果是`re1*k`
> 4. 当`re2-re1=re3-re2`时，结果呈等差数列，通用结果是`re1+(k-1)*(re2-re1)`
> 
> 根据这几种情况，增加几个`if`判断。整体的代码并不整洁，感觉也不够通用。


```js
var kConcatenationMaxSum = function (arr, k) {
    if (arr.length === 0 || k === 0) return 0;

    const maxSubArray = function (nums) {
        var sum = 0;
        var ans = nums[0];
        for (var num of nums) {
            if (sum > 0) sum = sum + num;
            else sum = num;
            ans = Math.max(ans, sum, 0);
        }
        return ans;
    };
    
    var re1 = maxSubArray(arr);
    if (k === 1) return re1 % (Math.pow(10, 9) + 7);
    var re2 = maxSubArray([...arr, ...arr]);
    if (k === 2) return Math.max(re1, re2) % (Math.pow(10, 9) + 7);
    var re3 = maxSubArray([...arr, ...arr, ...arr]);
    if (k === 3) return Math.max(re1, re2, re3) % (Math.pow(10, 9) + 7);
    if (re1 * 2 === re2 && re1 * 3 === re3) return (re1 * k) % (Math.pow(10, 9) + 7);
    else if (re2===re3) return (re3) % (Math.pow(10, 9) + 7);
    else if (re3-re2===re2-re1) return (re1 + (k-1)*(re2-re1)) % (Math.pow(10, 9) + 7);

    var temp = arr;
    for (var i = 1; i < k; i++) {
        arr = arr.concat(temp);
    }

    return maxSubArray(arr) % (Math.pow(10, 9) + 7);
};
```

解二：

解：
> 这个是TOP的解答，明显比我的要好很多。
> 
> 对结果的洞悉也非常到位：ans=sum1（第一个arr的右边）+sum2（第二个arr的左边）+其他arr的累加。
> 
> JavaScript复现如下：

```js
var kConcatenationMaxSum = function (arr, k) {
    var ans = 0;
    var s = [0]; //每个阶段累加和
    var f = [0]; //每个阶段最大值
    var sum1 = 0;
    var sum2 = 0;

    for (var i = 0; i < arr.length; i++) {
        s[i + 1] = s[i] + arr[i];
        f[i + 1] = Math.max(0, f[i] + arr[i]);
        ans = Math.max(ans, f[i + 1]);
    }
    if (k === 1) return ans; //单个arr的最大子序和

    var m = Math.max(s[arr.length], 0); //m为arr的累加和（非负）

    for (var i = 0; i <= arr.length; i++) {
        sum1 = Math.max(sum1, s[arr.length] - s[i]); //得到最大的（arr累加和-arr阶段累加和）
        sum2 = Math.max(sum2, s[i]); //得到最大的阶段累加和
    }
    
    //结果由三部分组成： sum1（第一个arr的右边）、sum2（第二个arr的左边）、其他arr的累加
    ans = Math.max(ans, sum1 + sum2 + (k - 2) * m);
    
    return ans % 1000000007;
};
```

## 5192 查找集群内的「关键连接」
力扣数据中心有`n`台服务器，分别按从`0`到`n-1`的方式进行了编号。

它们之间以「服务器到服务器」点对点的形式相互连接组成了一个内部集群，其中连接 `connections` 是无向的。

从形式上讲，`connections[i] = [a, b]` 表示服务器 `a` 和 `b` 之间形成连接。任何服务器都可以直接或者间接地通过网络到达任何其他服务器。

「关键连接」是在该集群中的重要连接，也就是说，假如我们将它移除，便会导致某些服务器无法访问其他服务器。

请你以任意顺序返回该集群内的所有 「关键连接」。


示例 1：
![](https://pic.rhinoc.top/mweb/15686186168377.jpg)


```
输入：n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]
输出：[[1,3]]
解释：[[3,1]] 也是正确的。
```

提示：
* $1 \leq n \leq 10^5$
* $n-1 \leq connections.length \leq 10^5$
* $connections[i][0] \neq connections[i][1]$
* 不存在重复的连接

解：
> 这道题一直没有头绪，只能比赛完看看大牛们的解题思路了。
> 参考TOP3的@awice的Python解法，用JavaScript复现了。
> 
> 由于之前对深度优先搜索和广度优先搜索都只是耳闻，理解起代码来比较困难，所以特意绘制了思维导图方便理解。
> 
> ![dfs-0,0-@2x](https://pic.rhinoc.top/mweb/dfs(0,0)@2x.png)

```js
var criticalConnections = function (n, connections) {
    //graph保存每个节点所连接的其他节点信息 初始化为空集
    var graph = Array.apply(null, Array(n)).map(function (v, i) {
        return [];
    });
    //visited 保存节点是否被访问过信息 初始化为false
    var visited = Array.apply(null, Array(n)).map(function (v, i) {
        return false;
    });
    //lowest 保存节点支路（即不包含prev）所能连接的最上级节点 初始化为-1
    var low = Array.apply(null, Array(n)).map(function (v, i) {
        return -1;
    });
    
    //ans 是最终要返回的结果 初始化为空集
    var ans = [];

    //得到每个节点所连接的节点详情
    for (var i = 0; i < connections.length; i++) {
        graph[connections[i][0]].push(connections[i][1]);
        graph[connections[i][1]].push(connections[i][0]);
    }

    const dfs = function (cur, prev = cur) {
        if (!visited[cur]) { //如果cur之前没被访问过
            visited[cur] = true; //标记cur已经被访问过
            low[cur] = cur;
        }

        for (var node of graph[cur]) { //遍历cur连接的所有node
            if (node !== prev) { //不走回头路
                if (!visited[node]) { //如果node还没有被访问过
                    dfs(node, cur); //访问node
                    low[cur] = Math.min(low[cur], low[node]); //确定cur的最上级
                    if (low[node] > cur) ans.push([cur, node]) //如果节点的最上级级别比cur低，那么node-cur为关键连接
                } else { //如果这个节点已经被访问过了
                    low[cur] = Math.min(low[cur], node); //重新确定cur的最上级
                }
            }
        }
    };

    for (var i = 0; i < n; i++) if (!visited[i]) dfs(i);
    return ans;
};
```



