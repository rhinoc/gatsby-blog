---
title: Python编程快速上手（九）订阅邮件自动退订器
date: 2019-02-20
category: etc
tags: ["python"]

---

## 程序描述

> 浏览一些网站时，基于各种原因（注册账户、消息订阅或是留联系方式），我们可能会将自己的邮箱地址提供给网站。于是邮箱每天都被大量的垃圾邮件或订阅邮件充斥，以至于真正重要的联络邮件泯然其中。

所以本篇博文的主题，就是如何用Python写一个脚本，能遍历邮箱中的订阅邮件并找出退订链接，输出到控制台中。

## 涉及知识点

*   imapclient
*   email
*   re

## 流程图

```
     +------------------+
     |                  |
     |  Log in mailbox  |
     |                  |
     +--------+---------+
              |
              |
+-------------v---------------+
|                             |
|   Search subscribed mails   |
|                             |
+-------------+---------------+
              |
              |
   +----------v-----------+
   |                      |
   |  fetch mail content  |
   |                      |
   +----------+-----------+
              |
              |
+-------------v---------------+
|                             |
|   Search unsubscribe link   |
|                             |
+-------------+---------------+
              |
              |
         +----v-----+
         |          |
         |  Output  |
         |          |
         +----------+
```

## 注意点

写这个程序花了我一定时间，主要是遇到了几个难点。一个是获取邮件内容，另一个是去试Unsubscribe的通配符。获取邮件内容相关的代码是在Stackflow上找到的，代码如下：  

```python
if email_message.is_multipart():
    for part in email_message.walk():
        ctype = part.get_content_type()
        cdispo = str(part.get('Content-Disposition'))
        if ctype == 'text/plain' and 'attachment' not in cdispo:
            body = part.get_payload(decode=True)
            break
        else:
            body = email_message.get_payload(decode=True)
```

关于通配符，这就需要根据大量的订阅邮件去找退订链接出现的特征，一句话，自己试。

## 效果图

![](https://pic.rhinoc.top/15506338744722.jpg)

## 代码

```python
import imapclient, email, re

# basic settings
account = 'account@outlook.com'
password = 'password'
folder = 'Inbox'

def parseBody(body):
    body = str(body).replace('\\r', '')
    body = str(body).replace('\\n', '')
    body = str(body).replace('\\x', '=')
    # print(body)
    return body

def finder(rr):
    url = rr.findall(body)[0]
    print('found: %s' % str(url))
    return url

# log in mailbox and search for mails
imapObj = imapclient.IMAPClient('imap-mail.outlook.com',ssl=True)
imapObj.login(account,password)
print('%s logged in' % account)
imapObj.select_folder(folder, readonly=True)
print('%s selected' % folder)
query = "BODY \"Unsubscribe\""
messages = imapObj.search(query)

mailfroms = []
print('Fetching...（take times)')
items = imapObj.fetch(messages, 'RFC822').items()

for uid, message_data in items:
    email_message = email.message_from_bytes(message_data[b'RFC822'])
    mailfrom = email_message.get('From')
    # avoid duplicate
    if mailfrom not in mailfroms:
        print(mailfrom)
        mailfroms.append(email_message.get('From'))
        # get email content
        if email_message.is_multipart():
            for part in email_message.walk():
                ctype = part.get_content_type()
                cdispo = str(part.get('Content-Disposition'))
                if ctype == 'text/plain' and 'attachment' not in cdispo:
                    body = part.get_payload(decode=True)
                    body = parseBody(body)
                    break
        else:
            body = email_message.get_payload(decode=True)
            body = parseBody(body)
        try:
            rr1 = re.compile(r'<a href="(https?:\/\/.*?)".*?[Uu]nsubscribe[\s\S]*?<\/a>')
            url = finder(rr1)
        except:
            try:
                rr2 = re.compile(r'(https?:\/\/[.\S]*?unsubscribe.*?)["\)\s]')
                url = finder(rr2)
            except:
                try:
                    rr3 = re.compile(r'[Uu]nsubscribe.*?(http.*?)\s')
                    url = finder(rr3)
                except:
                    try:
                        rr4 = re.compile(r'Unsubscribe[\s]?(https?:.*?)[\'\s]')
                        url = finder(rr4)
                    except:
                        try:
                            rr5 = re.compile(r'(https?:\/\/[.\S]*?).{1,10}[Uu]nsubscribe.*?\s')
                            url = finder(rr5)
                        except:
                            print("not found")

print("Done.")
```
