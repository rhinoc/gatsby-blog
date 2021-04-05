---
title: LeetCode上的「简单」题（五）108-119
date: 2019-08-18
category: cs
tags: ["leetcode"]

---
## 108 将有序数组转换为二叉搜索树

将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。

本题中，一个高度平衡二叉树是指一个二叉树**每个节点**的左右两个子树的高度差的绝对值**不超过1**。

示例:
```
给定有序数组: [-10,-3,0,5,9],

一个可能的答案是：[0,-3,9,-10,null,5]，它可以表示下面这个高度平衡二叉搜索树：

      0
     / \
   -3   9
   /   /
 -10  5
```

解：
> 使用递归。

```js
var sortedArrayToBST = function(nums) {
   if (!nums.length) return null;
    const re = new TreeNode(null);
    if(nums.length > 1) {
        re.left = sortedArrayToBST(nums.splice(0, nums.length / 2));//截取nums的左半部分
    }
    re.val = nums[0];//选取中位数作为当前值
    re.right = sortedArrayToBST(nums.splice(1));//截取nums的右半部分
    return re;
};
```
![](https://pic.rhinoc.top/mweb/15657865431954.jpg)

## 110 平衡二叉树


解一：

> 参考[107 二叉树的层次遍历 II](./leetcode_4)，对于每一个节点得到左子树和右子树的深度，判断它们的差值是否大于1。不足之处在于自上而下的遍历导致了大量重复计算，时间复杂度为$O(n^2)$。

```js
//迭代获取二叉树深度
function getDepth(root) {
    if (root===null) return 0;
    var depth = 0;
    var queue = [root];
    while(queue.length){
        var arr = [];
        while(queue.length){
            var curr = queue.shift();
            if (curr.left) arr.push(curr.left);
            if (curr.right) arr.push((curr.right));
        }
        depth++;
        queue = arr;
    }
    return depth
}

// 递归获取二叉树深度
function getDepth(root) {
    if (root===null) return 0;
    return 1+Math.max(getDepth(root.left),getDepth(root.right))
}

var isBalanced = function(root) {
    if (root===null) return true;
    var left = getDepth(root.left);
    var right = getDepth(root.right);
    if(left-right>1||right-left>1) return false;
    else return isBalanced(root.left)&&isBalanced(root.right);
};
```

解二：
> 于是我们就想是否能从下往上计算深度，这样就可以避免重复运算了。但由于二叉树的特性，想要得到最底层的节点，还得是从第一个节点一个一个找下去。那是不是就非重复计算不可了呢？非也。试想，如果让递归具有记忆的话，如果之前计算过则直接取用记忆中的数据，当然也可以避免重复计算。

```js
function getDepth(root) {
    if (root === null) return 0;
    var left = getDepth(root.left);
    if (left === -1) return -1; //有记忆的递归
    var right = getDepth(root.right);
    if (right === -1) return -1;
    return Math.abs(left-right)<2? 1+Math.max(left,right):-1
}

var isBalanced = function(root) {
    return getDepth(root) !== -1;
};
```
![](https://pic.rhinoc.top/mweb/15657968730090.jpg)

## 111 二叉树的最小深度

给定一个二叉树，找出其最小深度。
最小深度是从根节点到最近叶子节点的最短路径上的**节点数量**。
说明: 叶子节点是指**没有子节点**的节点。

示例:

给定二叉树 `[3,9,20,null,null,15,7]`,
```
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最小深度  2.

解：
> 本来打算直接在「递归获取二叉树深度」的基础上将`Math.max`改成`Math.min`来做的，结果发现自己还是太天真了。这里的最小深度是从根节点到叶子节点的最少节点数量。而叶子节点指的是`left`和`right`均为`null`的节点。

```js
function minDepth(root) {
    if (root === null) return 0;
    if (!root.left&&!root.right) return 1;//当前节点为叶子节点时
    if (root.left&&!root.right) return 1+minDepth(root.left);//只有一个字节点时 减枝
    if (!root.left&&root.right) return 1+minDepth(root.right);//只有一个字节点时 减枝
    return 1+Math.min(minDepth(root.left),minDepth(root.right)) //存在两个字节点
}
```
![](https://pic.rhinoc.top/mweb/15657992003489.jpg)

## 112 路径总和

给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。

说明: 叶子节点是指没有子节点的节点。

示例: 
给定如下二叉树，以及目标和 `sum = 22`：
```
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \      \
        7    2      1
```

返回 `true`, 因为存在目标和为 22 的根节点到叶子节点的路径 5->4->11->2。

解：

> 做了这么多二叉树，用递归做准没错。注意这里每个节点上的值可能为负，所以想用范围限制来剪枝是不行的。

```js
var hasPathSum = function(root, sum) {
    if (!root) return false;
    if (root.val===sum&&!root.left&&!root.right) return true;
    else return hasPathSum(root.left,sum-root.val)||hasPathSum(root.right,sum-root.val)
    return false
};
```

## 118 杨辉三角
给定一个非负整数 numRows，生成杨辉三角的前 numRows 行。

![](https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif)

在杨辉三角中，每个数是它左上方和右上方的数的和。

示例:
```
输入: 5
输出:
[
     [1],
    [1,1],
   [1,2,1],
  [1,3,3,1],
 [1,4,6,4,1]
]
```

> 循环做。

```js
var generate = function (numRows) {
    var re = [];
    if (numRows === 0) return re;
    re[0] = [1];
    if (numRows === 1) return re;
    re[1] = [1, 1];
    if (numRows === 2) return re;

    for (var i = 2; i < numRows; i++) { //第i+1行 共有i+1个元素
        var line = [];
        line[0] = 1;
        line[i] = 1;
        for (var j = 1; j < i; j++)//第j个
            line[j] = re[i - 1][j - 1] + re[i - 1][j];
        re.push(line)
    }
    return re;
};
```

> 也可以用递归。

```js
var generate = function (numRows) {
    if (numRows === 0) return [];
    if (numRows === 1) return [[1]];
    if (numRows === 2) return [[1], [1, 1]];

    var re = generate(numRows - 1);
    var line = [];
    line[0] = 1;
    line[numRows-1] = 1;
    for (var j = 1; j < numRows-1; j++)//第j个
        line[j] = re[numRows - 2][j - 1] + re[numRows - 2][j];
    re.push(line);
    return re
};
```

## 119 杨辉三角 II
给定一个非负索引 k，其中 k ≤ 33，返回杨辉三角的第 k 行。

示例:
```
输入: 3
输出: [1,3,3,1]
```

解一：
> 基于上一题循环方法修改

```js
var getRow = function (rowIndex) {
    var re = [];
    re[0] = [1];
    if (rowIndex === 0) return re[0];
    re[1] = [1, 1];
    if (rowIndex === 1) return re[1];

    for (var i = 2; i <= rowIndex; i++) {
        var line = [];
        line[0] = 1;
        line[i] = 1;
        for (var j = 1; j < i; j++)
            line[j] = re[i - 1][j - 1] + re[i - 1][j];
        re.push(line)
    }
    return re[rowIndex];
};
```

解二：
> 基于上一题中解二递归法修改，注意这里的输入是`rowIndex`，而不是行数。

```js
var getRow = function(rowIndex) {
    if (rowIndex === 0) return [1];
    if (rowIndex === 1) return [1,1];

    var re = getRow(rowIndex - 1);
    var line = [];
    line[0] = 1;
    line[rowIndex] = 1;
    for (var j = 1; j < rowIndex; j++)
        line[j] = re[j - 1] + re[j];
    return line
};
```




