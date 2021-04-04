---
title: Python编程快速上手（四）多重剪贴板
date: 2019-01-30
category: etc
tags: ["python"]

---

## 程序描述

*   当不传入参数时，程序监视并保存剪贴板内容
*   为保存的剪贴板内容设置关键字，通过关键字可访问到保存的内容
*   `ls` 显示所有关键字
*   `clear` 清空剪贴板历史记录

## 涉及知识点

*   Shelve
*   pyperclip

## 代码

```python
#! python3
import pyperclip, sys, shelve

keywords = shelve.open('cp.db')

def help():
    print('Usage: python filename.py ls - show all keywords')
    print('Usage: python filename.py save [keyword] - save the clipboard content as keyword')
    print('Usage: python filename.py [keyword] - copy the content to clipboard')
    print('Usage: python filename.py clear - empty the history')
    sys.exit()


if len(sys.argv) < 2:
    i = 1
    while True:
        keywords[str(i)] = pyperclip.paste()
        if pyperclip.paste() != keywords[str(i)]:
            i += 1

inputstr = sys.argv[1]
if inputstr == 'ls':
    for key in keywords.keys():
        print(key)
elif inputstr == 'clear':
    keywords.clear()
    exit()
elif inputstr == 'save':
    try:
        inputstr2 = sys.argv[2]
        keywords[inputstr2] = pyperclip.paste()
        print(keywords[inputstr2])
        print('CONTENT SAVED')
    except:
        help()
elif inputstr in keywords.keys():
    print(keywords[inputstr])
    pyperclip.copy(keywords[inputstr])
    print('CONTENT COPIED')
else:
    help()

keywords.close()
```
