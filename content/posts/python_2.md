---
title: Python编程快速上手（二）井字游戏
date: 2019-01-28
category: etc
tags: ["python"]

---

## 程序描述

井字游戏  
* V0.1  
游戏模式为用户VS用户，计算机仅作为游戏内容的输出  
* V0.2  
游戏模式为用户VS计算机，计算机落棋点随机  
* V1.0  
游戏模式为用户VS计算机，计算机落棋点基于当前棋子分布，并且具有两层优先级（己方获胜>阻止敌方获胜）

## 涉及知识点

*   import
*   列表、字典
*   函数
*   格式化输出

## 代码
```python
import random

theBoard = {1:'\033[37m1\033[0m',2:'\033[37m2\033[0m',3:'\033[37m3\033[0m',
            4:'\033[37m4\033[0m',5:'\033[37m5\033[0m',6:'\033[37m6\033[0m',
            7:'\033[37m7\033[0m',8:'\033[37m8\033[0m',9:'\033[37m9\033[0m'}

def printBoard(board):
    print(board[1] + '|' + board[2] + '|' + board[3])
    print('-+-+-')
    print(board[4] + '|' + board[5] + '|' + board[6])
    print('-+-+-')
    print(board[7] + '|' + board[8] + '|' + board[9])

def tripleChecker(a,b,c):
    if a==b and b==c:
        return 1
    elif a==b:
        return 0.3
    elif b==c:
        return 0.1
    elif a==c:
        return 0.2
    else:
        return 0

def winner(b):
    if tripleChecker(b[1],b[5],b[9]) == 1 or tripleChecker(b[4],b[5],b[6]) == 1 or tripleChecker(b[3],b[5],b[7]) == 1 or tripleChecker(b[2],b[5],b[8]) == 1:
        return b[5]
    if tripleChecker(b[1],b[2],b[3]) == 1 or tripleChecker(b[1],b[4],b[7]) == 1:
        return b[1]
    if tripleChecker(b[7],b[8],b[9]) == 1 or tripleChecker(b[3],b[6],b[9]) == 1:
        return b[9]
    else:
        return 0

# Random Mode
def bot1(b):
    while True:
        move = random.randint(1, 9)
        if b[move] != 'X' and b[move] != 'O':
            return move

# Smart Mode
def bot2(b,turn):
    move = 0
    arr = [b[1], b[5], b[9], b[4], b[5], b[6], b[3], b[5], b[7], b[2], b[5], b[8],
           b[1], b[2], b[3], b[1], b[4], b[7], b[7], b[8], b[9], b[3], b[6], b[9]]
    arri = [1,5,9,4,5,6,3,5,7,2,5,8,1,2,3,1,4,7,7,8,9,3,6,9]
    for i in range(1,9):
        tri = tripleChecker(arr[3*i-3], arr[3*i-2], arr[3*i-1])
        if tri == 0.1:
            if b[arri[3*i-3]] != 'X' and b[arri[3*i-3]] != 'O':
                move = arri[3*i-3]
                if arr[3*i-2] == turn:
                    return move
        elif tri == 0.2:
            if b[arri[3*i-2]] != 'X' and b[arri[3*i-2]] != 'O':
                move = arri[3*i-2]
                if arr[3*i-1] == turn:
                    return move
        elif tri == 0.3:
            if b[arri[3*i-1]] != 'X' and b[arri[3*i-1]] != 'O':
                move = arri[3*i-1]
                if arr[3*i-2] == turn:
                    return move
    if move!=0:
        return move
    else:
        return bot1(b)


print("X or O, Choose one")
role = input()
turn = 'X'
print("You chosed " + role + "\n")

i = 0
while winner(theBoard) == 0 and i<9:
    i += 1
    if turn == role:
        printBoard(theBoard)
        print("Turn for you. Move on which space?")
        while True:
            move = int(input())
            if theBoard[move] != 'X' and theBoard[move] != 'O':
                theBoard[move] = turn
                break
            print("The place is taken, try another one")
    else:
         # theBoard[bot1(theBoard)] = turn
         theBoard[bot2(theBoard,turn)] = turn

    if turn == 'X':
        turn = 'O'
    else:
        turn = 'X'

printBoard(theBoard)

if i != 9:
    if winner(theBoard) == role:
        print("You Win!")
    else:
        print("You Lose!")
else:
    print('Draw')
```