---
title: Python编程快速上手（七）Unsplash批量下载器
date: 2019-02-02
category: etc
tags: ["python"]

---

## 程序描述

* V1.0  
输入关键字搜索图片，模拟页面下拉获取更多图片，页面加载完成后获取图片链接并下载至指定文件夹。

* V2.0  
解决了V1.0版本存在的两个严重问题。更改为深入二级链接获取图片，从而不再需要等待一级页面加载完毕。

![](https://pic.rhinoc.top/15491094362245.jpg)

## 涉及知识点

*   selenium
*   bs4
*   iter_content()
*   javascript

## V1.0存在的问题 & V2.0的解决方法

*   获取图片链接需要预先对页面进行加载，下载图片时相当于进行了二次加载，造成了不必要的网络和时间占用。
*   即便给予充足的加载时间，页面也不能完全加载，导致捕获到的图片有一千余张而实际有效的图片不足十张。

对于一个图片爬虫来说，连图片都爬不下来得是件多羞耻的事情。所以在面对V1.0版本的诸多不足时，我的当务之急是解决第二个问题，其次再是对程序进行优化。幸运的是，就像问题总是相伴而生一样，解决了第二个问题时，我恰巧也把第一个问题解决了。

首先，疑惑于明明加载了那么久页面却会「获取不到图片链接」，我将加载出来的页面保存下来查看。  

```python
page = open(os.path.join('pics', 'saved.html'),'wb')  
page.write(soup.encode('utf-8'))  
```

打开`saved.html`后，我发现虽然图片链接未能加载出来，但是图片所指向的二级链接却赫然在目。  
![](https://pic.rhinoc.top/15491090497381.jpg)

打开二级链接，不出意外，就是我求之而不得的图片。  
自然，我就想到，如果在当前这个一级页面不能得到图片链接，是不是可以通过进入二级链接获取图片，而且由于二级链接所指向的页面只有一张图片，图片加载的成功率必然也很高。

如此这般，problems solved 👌🏻。

## 第一版代码

```python
#! python3
import os, bs4, requests, re, time
from selenium.webdriver.chrome.options import Options
from selenium import webdriver

def scroll_down(driver, times):
    print('Loading',end='')
    for i in range(times):
        print('.',end='')
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(60)
    print('')

os.makedirs('pics',exist_ok=True)

keyword = input()
url = 'https://unsplash.com/search/photos/' + keyword

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
print('Setting up the driver')
driver = webdriver.Chrome(options=chrome_options, executable_path='/usr/local/bin/chromedriver')
driver.get(url)
print('Driver prepared')

scroll_down(driver,3)
soup = bs4.BeautifulSoup(driver.page_source, 'lxml')
page = open(os.path.join('pics', 'saved.html'),'wb')
page.write(soup.encode('utf-8'))
link = soup.find_all('img',{'class':'_2zEKz'})
amount = str(soup.find('p',{'class':'_1u88E _1iWCF _27Bp2'}))
rr = re.compile(r'.*>(.*?)free.*')
amount = rr.findall(amount)[0].strip()
amount = int(amount.replace(',',''))
print('Total: '+ str(amount))
print('Captured: '+ str(len(link)))

count = 0
for piece in link:
    #
    picLk = str(piece.get('src'))
    rr = re.compile(r'(.* ?)\?')
    filename = str(piece.get('alt')) + '.png'
    if picLk != 'None':
        count += 1
        picLk = rr.findall(picLk)[0]
        print('Download from ' + picLk + ': ' + filename )
        picRes = requests.get(picLk)
        if filename == 'None.png':
            imageFile = open(os.path.join('pics', os.path.basename(picLk)+'.png'),'wb')
        else:
            imageFile = open(os.path.join('pics', filename),'wb')
        for chunk in picRes.iter_content(100000):
             imageFile.write(chunk)
        imageFile.close()

print('Valid:' + str(count))
```

## 第二版代码

```python
#! python3

import os, bs4, requests, re, time
from selenium.webdriver.chrome.options import Options
from selenium import webdriver

def scroll_down(driver, times):
    print('Loading',end='')
    for i in range(times):
        print('.',end='')
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)
    print('')

os.makedirs('pics',exist_ok=True)

keyword = input()
url = 'https://unsplash.com/search/photos/' + keyword

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
print('Setting up the driver')
driver = webdriver.Chrome(options=chrome_options, executable_path='/usr/local/bin/chromedriver')
driver.get(url)
print('Driver prepared')

scroll_down(driver,3)
soup = bs4.BeautifulSoup(driver.page_source, 'lxml')
link = soup.find_all('a',{'class':'_2Mc8_'})
amount = str(soup.find('p',{'class':'_1u88E _1iWCF _27Bp2'}))
rr = re.compile(r'.*>(.*?)free.*')
amount = rr.findall(amount)[0].strip()
amount = int(amount.replace(',',''))
print('Total: '+ str(amount))
print('Captured: '+ str(len(link)))

count = 0
for piece in link:
    deepLk = 'https://unsplash.com' + str(piece.get('href'))
    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Origin': 'http://www.zimuzu.tv',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    deepRes = requests.get((deepLk), headers=headers)
    deepSoup = bs4.BeautifulSoup(deepRes.text, "html.parser")
    pic = deepSoup.find('img',{'class':'_2zEKz'})
    try:
        picLk = str(pic.get('src'))
    except:
        print('download failed')
    rr = re.compile(r'(.* ?)\?')
    filename = str(pic.get('alt')) + '.png'
    if picLk != 'None':
        count += 1
        picLk = rr.findall(picLk)[0]
        print('Download from ' + deepLk + ': ' + filename )
        picRes = requests.get(picLk)
        if filename == 'None.png':
            imageFile = open(os.path.join('pics', os.path.basename(picLk)+'.png'),'wb')
        else:
            imageFile = open(os.path.join('pics', filename),'wb')
        for chunk in picRes.iter_content(100000):
                imageFile.write(chunk)
        imageFile.close()
```