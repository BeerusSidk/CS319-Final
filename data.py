from bs4 import BeautifulSoup
import requests
import json
import random
import re
import time
from pymongo import MongoClient
from itertools import cycle

categories = {'appetizer', 'rice', 'noodles', 'beef', 'pork'}

totalLink = set()

id = 0

connec = 0

proxyList = [
    "130.58.218.30:80",
"145.40.68.148:10017",
"41.89.16.6:80",
"198.12.254.161:3128",
"72.10.164.178:22837",
"185.217.136.67:1337",
"145.40.90.211:10005",
"69.197.135.43:18080",
"35.185.196.38:3128",
"145.40.68.148:10003"
]

proxy_pool = cycle(proxyList)

currentProxy = next(proxy_pool)

client = MongoClient('localhost', 27017)
db = client['finalProj319']  
collection = db['food1']  


def randomPopular():
    a = random.randint(0, 6)
    if (a > 5):
        return True
    else:
        return False
    

def findCategory(list):
    for item in list:
        if item in categories:
            # print(item)
            return item
    return "other"


def getResponse(url):
    global currentProxy
    while (True):
        try:
            response = requests.get(url, proxies={'http': currentProxy, 'https': currentProxy})
            return response
        except requests.exceptions.ProxyError:
            # Handle proxy error by moving to the next proxy
            currentProxy = next(proxy_pool)
        except requests.exceptions.ConnectTimeout:
            # Handle connection timeout by moving to the next proxy
            currentProxy = next(proxy_pool)
        except StopIteration:
            # Handle the case where all proxies have been exhausted
            print("All proxies have been exhausted.")
            return None
        except Exception:
            currentProxy = next(proxy_pool)


def parse(endpoint, cate):
    global connec
    connec += 1
    time.sleep(0.1)
    url = 'https://www.vickypham.com'
    url = url + endpoint
    print(f"{id} Fetching {url}, attempt {connec}")
    response = getResponse(url)
    soup = BeautifulSoup(response.text, 'html.parser')  

    divs = soup.find_all('div', class_="sqs-block code-block sqs-block-code")

    new_json_object = None
    for div in divs:
        script = div.find('script', class_="ccm-schema")
        if script:
            json_object = json.loads(script.string)
            # print(json_object)

            # cate = findCategory(json_object['recipeCategory'].split(", "))
            new_json_object = {"id": id,
                                "dishName": json_object['name'],
                               "description": json_object['description'],
                               "ingredients": json_object['recipeIngredient'],
                                "how_to_cook": json_object['recipeInstructions'],
                                "category": cate,
                                "imageUrl": json_object['image'],
                                "isPopular": randomPopular()
                               }
            break
    if connec >= 3:
        connec = 0
        print(f"{id} Failed")
        return None
    if new_json_object is None:
        response.close()
        new_json_object = parse(endpoint, cate)
    response.close()
    connec = 0
    return new_json_object
    

def insert_into_mongodb(json_data):
    collection.insert_one(json_data)


def directToCategory(endpoint):
    global id
    time.sleep(0.1)
    url = 'https://www.vickypham.com' + endpoint
    response = requests.get(url)
    if response.status_code == 200:
        print("Request successful")
    else:
        print("Request failed with status code:", response.status_code)
    soup = BeautifulSoup(response.text, 'html.parser')  

    list = soup.find_all('a', class_ = 'summary-title-link')

    pattern = r"^/blog/"


    for item in list:
        link = item.get('href')
        if re.match(pattern, link) and link not in totalLink:
            id += 1
            totalLink.add(link)
            # print(str(id) + "  " + link)
            record = parse(link, endpoint[1::])

            if record is None:
                continue

            print(str(id)+ " " + record['dishName'])
            insert_into_mongodb(record)


def scrapeData():
    url = 'https://www.vickypham.com/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')  

    list1 = soup.find_all('a', class_ = 'Header-nav-item')
    count1 = 0
    for item1 in list1:
        link1 = item1.get('href')
        if re.match("^\/", link1):
            count1 += 1
            if count1 < 5 and count1 != 2:
                directToCategory(link1)

    count2 = 0
    list2 = soup.find_all('a', class_ = 'Header-nav-folder-title')
    for item2 in list2:
        link2 = item2.get('href')
        if re.match("^\/", link2):
            count2 += 1
            if count2 < 3:
                directToCategory(link2)



if __name__ == "__main__":
    scrapeData()