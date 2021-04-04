---
title: LeetCode上的「简单」题（四）83-107
date: 2019-08-14
category: cs
tags: ["leetcode"]

---

## 83 删除排序链表中的重复元素
给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。

示例 1:
```
输入: 1->1->2
输出: 1->2
```

示例 2:
```
输入: 1->1->2->3->3
输出: 1->2->3
```
解一：
> 使用递归。

```js
var deleteDuplicates = function (head) {
    if (!head||!head.next) return head;
    else if(head.next.val===head.val) return deleteDuplicates(head.next);
    else {
        head.next = deleteDuplicates(head.next);
        return head
    }
};
```
![](https://pic.rhinoc.top/mweb/15656655467119.jpg)

解二：
> 使用循环。这里涉及JavaScript的「引用传递」，对`cur`的修改也会同步到`head`中。

```js
var deleteDuplicates = function (head) {
    var cur = head;
    while(cur&&cur.next){
        if (cur.next.val===cur.val) cur = cur.next;
        else cur.next = cur.next.next
    }
    return head;
};
```
![](https://pic.rhinoc.top/mweb/15656661636945.jpg)

## 88 合并两个有序数组

给定两个有序整数数组 nums1 和 nums2，将 nums2 合并到 nums1 中，使得 num1 成为一个有序数组。

说明:

* 初始化`nums1`和`nums2`的元素数量分别为`m`和`n`。
* 你可以假设`nums1`有足够的空间（空间大小大于或等于`m`+`n`）来保存`nums2`中的元素。

示例:
```
输入:
nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6],       n = 3

输出: [1,2,2,3,5,6]
```

解一：
> 数组拼接后`sort`排序。缺点是没有利用`nums1`和`nums2`本身是有序数组的优势。

```js
var merge = function(nums1, m, nums2, n) {
    for (var i = 0;i<nums2.length;i++) nums1[m+i] = nums2[i];
    nums1.sort(function (a,b) {
        return a-b
    })
};
```

解二：
> 插入排序，由于`nums1`和`num2`均为有序数组，所以`j`不需要每次循环都复位。

```js
var merge = function (nums1, m, nums2, n) {
    var j = 0;//nums1的第j位
    for (var i = 0; i < nums2.length; i++) {//nums2的第i位
        while (!(nums2[i] < nums1[j] || j >= m + i)) j++;
        for (var k = nums1.length - 1; k > j; k--) nums1[k] = nums1[k - 1];
        nums1[j] = nums2[i];
    }
};
```
[[danger|坑]]
|初始代码中有一句话："@return {void} Do not return anything, modify nums1 in-place instead."，注意其中的`in-place`，OJ不看`return`，只看`nums1`，这说明要在`num1`上做修改，并且类似`concat`和`slice`之类的方法都无效。

## 100 相同的树
给定两个二叉树，编写一个函数来检验它们是否相同。
如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。

示例 1:
```
输入:       1         1
          / \       / \
         2   3     2   3

        [1,2,3],   [1,2,3]

输出: true
```
示例 2:
```
输入:      1          1
          /           \
         2             2

        [1,2],     [1,null,2]

输出: false
```
示例 3:
```
输入:       1         1
          / \       / \
         2   1     1   2

        [1,2,1],   [1,1,2]

输出: false
```

解一：
> 先比较`p`和`q`的`val`，若相等则进一步判断`p`和`q`左右节点是否相等。这种「进一步」运用了递归的思想。这道题要注意处理好「存在与否」的问题，因此我使用了数组`cur`来保存左右节点的值，若不存在则保存`null`，避免了`.val`的上一级是`undefined`的问题。

```js
var isSameTree = function (p, q) {
    if (!p || !q) return p === q;
    if (p.val === q.val) {
        var cur = [];
        cur[0] = p.left ? p.left.val : null;
        cur[1] = q.left ? q.left.val : null;
        cur[2] = p.right ? p.right.val : null;
        cur[3] = q.right ? q.right.val : null;
        if (cur[0] === cur[1] && cur[2] === cur[3]) {
            if (cur[0] === null && cur[2] === null) return true;
            return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
        } else return false
    } else return false
};
```

解二：
> 看了一下其他同学的题解，发现我是傻了，每次比较当前的`val`就好了，不需要再比较左右节点，因为下一次递归的时候还是会比较`val`的。

```js
var isSameTree = function(p, q) {
    if(p == null || q == null) return p===q;
    if(p.val != q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

解三：
> 调试的时候总会`console.log`看一下`p`和`q`的结构，于是我就想，直接用字符串比较岂不更好？

```js
var isSameTree = function (p, q) {
    p = JSON.stringify(p);
    q = JSON.stringify(q);
    return p===q
};
```
![](https://pic.rhinoc.top/mweb/15657026783043.jpg)

## 101 对称二叉树

错误的尝试：
> 在上一题的基础上写的，因为考虑到`isSymmetric`只接受一个参数，因此又自作聪明用了`cur`来保存左右节点的值。这样比较下来确保的并不是二叉树对称（整体对称），而是每个节点的左右节点值相等，也就是局部对称。

```js
var isSymmetric = function(root) {
    if (root===null) return true;
    var cur = [];
    cur[0] === root.left? root.left.val:null;
    cur[1] === root.right? root.left.val:null;
    if (cur[0]!==cur[1]) return false;
    return isSymmetric(root.left)&&isSymmetric(root.right)
};
```

解：
> 看了官方解答，就像发现了新大陆一样，原来「对称」可以放到更大的格局，一个对称的物体必然和自身成镜像。所以可以给`isSymmetric`增加一个镜像参数。

![](https://pic.rhinoc.top/mweb/15657056522228.jpg)
![](https://pic.rhinoc.top/mweb/15657056607130.jpg)



```js
var isSymmetric = function (p, q = p) {
    if (p === null || q === null) return p === q;
    if (p.val !== q.val) return false;
    return isSymmetric(p.left, q.right) && isSymmetric(p.right, q.left)
};
```
![](https://pic.rhinoc.top/mweb/15657047903946.jpg)

 参考资料：
* [力扣官方题解：对称二叉树](https://leetcode-cn.com/problems/symmetric-tree/solution/dui-cheng-er-cha-shu-by-leetcode/)
* [精选题解：画解算法：101. 对称二叉树 —— 灵魂画师牧码](https://leetcode-cn.com/problems/symmetric-tree/solution/hua-jie-suan-fa-101-dui-cheng-er-cha-shu-by-guanpe/)

## 104 二叉树的最大深度

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

说明: 叶子节点是指没有子节点的节点。

示例：

给定二叉树`[3,9,20,null,null,15,7]`，
```
    3
   / \
  9  20
    /  \
   15   7
```
返回它的最大深度 3 。

解：
> 递归。

```js
var maxDepth = function(root) {
    if (root===null) return 0;
    return 1 + Math.max(maxDepth(root.left),maxDepth(root.right));
};
```

## 107 二叉树的层次遍历 II
给定一个二叉树，返回其节点值自底向上的层次遍历。（即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）

例如：
给定二叉树 `[3,9,20,null,null,15,7]`,
```
    3
   / \
  9  20
    /  \
   15   7
```
返回其自底向上的层次遍历为：
```
[
  [15,7],
  [9,20],
  [3]
]
```

解：
> 迭代。

```js
var levelOrderBottom = function (root) {
    if (!root) return [];
    var queue = [root];
    var n = 0;
    var ans = [];
    if (root.val !== null) ans.push([root.val]);
    while (queue.length) {
        var arr = [];
        var line = [];
        while (queue.length) {
            var curr = queue.shift();
            if (curr.left) {
                arr.push(curr.left);
                line.push(curr.left.val);
            }
            if (curr.right) {
                arr.push(curr.right);
                line.push(curr.right.val)
            }
        }
        n++;
        queue = arr;
        if (line.length) ans.unshift(line);
    }
    return ans
};
```
