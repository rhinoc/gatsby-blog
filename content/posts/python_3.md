---
title: Python编程快速上手（三）密码箱
date: 2019-01-29
category: etc
tags: ["python"]

---

## 程序描述

用户可通过密码箱添加账户-密码条目、查看密码箱中保存的账户、复制保存的密码。账户名和密码保存在同目录下的.db文件中，其中，账户名为明文保存，密码为DES加密保存。

## 涉及知识点

*   字典
*   字符串处理
*   DES
*   文件操作

## 代码

```python
#! python3

from pyDes import des, CBC, PAD_PKCS5
import binascii
import sys, pyperclip, getpass

# DES encrypt
def ecrypt(key, s):
    k = des(key, CBC, key, pad=None, padmode=PAD_PKCS5)
    en = k.encrypt(s, padmode=PAD_PKCS5)
    return binascii.b2a_hex(en)
# DES decrypt
def decrypt(key, s):
    k = des(key, CBC, key, pad=None, padmode=PAD_PKCS5)
    de = k.decrypt(binascii.a2b_hex(s), padmode=PAD_PKCS5)
    return de

# read database
readAccounts = open('./a.db','r')
readPass = open('./p.db','r')
try:
    accounts = eval(readAccounts.read())
except:
    accounts = {}
try:
    passwords = eval(readPass.read())
except:
    passwords = {}
readAccounts.close()
readPass.close()

if len(sys.argv) < 2:
    print('Usage: python filename.py [account] - copy account password')
    print('Usage: python filename.py ls - list accounts')
    sys.exit()

inputstr = sys.argv[1]
if inputstr in accounts:
    key = getpass.getpass('KEY:')
    password = str(decrypt(key,passwords[inputstr]))
    password = password[2:2]+password[2:len(password)-1]
    pyperclip.copy(password)
    print('PASSWORD COPIED')
elif inputstr == 'ls':
    for account in accounts.keys():
        print(account)
else:
    print('NO ACCOUNT FOUND')
    print('Do you want to creat a new entry? (y/n)')
    inputstr2 = input()
    if inputstr2.lower() == 'y':
        key = getpass.getpass('KEY:')
        accounts[inputstr] = input('Please input the account name:')
        password = getpass.getpass('Please input the password:')
        passwords[inputstr] = ecrypt(key,password)
        open('./a.db', 'w').write(str(accounts))
        open('./p.db', 'w').write(str(passwords))
    else:
        exit()
```