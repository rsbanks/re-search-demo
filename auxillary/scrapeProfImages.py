# tutorial from: https://www.youtube.com/watch?v=m_agcM_ds1c

import urllib
import urllib.request
from bs4 import BeautifulSoup
import os
from string import ascii_lowercase
def make_soup(url):
    page= urllib.request.urlopen(url)
    soupdata = BeautifulSoup(page, "html.parser")
    return soupdata

url = "https://orfe.princeton.edu/people/faculty"
soup = make_soup(url)
i = 0
for img in soup.findAll('img'):
    temp=img.get('src')
    if temp[:1]=="/":
        image = url + temp
    else:
        image = temp

    nametemp = img.get('alt')
    if nametemp is None:
        filename=str(i)
        i=i+1
    else:
        filename=nametemp

    imagefile = None
    try:   
        imagefile = open(filename + ".jpeg", 'wb')
        imagefile.write(urllib.request.urlopen(image).read())
        imagefile.close()
    except Exception as e:
        print(str(e))