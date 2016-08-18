from selenium import webdriver
from random import randint
import time

driver = webdriver.PhantomJS()
driver.get("https://www.reddit.com/r/malefashionadvice/search?q=This+thread+is+for+simple+style+questions+that+don%27t+warrant+their+own+thread&restrict_sr=on&sort=new&t=all")

outputfile = open('dailyurl.txt', 'w')

results = driver.find_elements_by_partial_link_text("Simple Questions - ")

print (results[0].get_attribute("href")[:-17] + "\n")
outputfile.write(results[0].get_attribute("href")[:-17] + "\n")

outputfile.close()
