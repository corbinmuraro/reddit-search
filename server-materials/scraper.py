from selenium import webdriver
from random import randint
import time


driver = webdriver.phantomjs()
driver.get("https://www.reddit.com/r/malefashionadvice/search?q=This+thread+is+for+simple+style+questions+that+don%27t+warrant+their+own+thread&restrict_sr=on&sort=new&t=all")

count = 1

outputfile = open('whatthefuck.txt', 'w')

while count < 50:
	results = driver.find_elements_by_partial_link_text("Simple Questions - ")

	print "Page " + str(count)
	for item in results:
		print (item.get_attribute("href")[:-17] + "\n")
		outputfile.write(item.get_attribute("href")[:-17] + "\n")

	count += 1
	time.sleep(randint(10,12))

	driver.find_element_by_partial_link_text("next ").click()

outputfile.close()
