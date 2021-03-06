# from selenium import webdriver  
from random import randint
import time
import datetime
import praw
import pysolr

submissionIDs = []

r = praw.Reddit('/r/malefashionadvice simple question search 1.0 by u/grinch_ '
				'see corbinmuraro.com/reddit-search')

# uses PRAW to get the first 1000 MFA Simple Question Thread Submission IDs
def getSubmissionIDs():
	results = r.search('This thread is for simple style questions that don\'t warrant their own thread', subreddit='malefashionadvice', sort='new', limit=10)
	for item in results:
		submissionIDs.append(item.permalink[52:58])

	print len(submissionIDs)

# driver = webdriver.Firefox()
# driver.get("https://www.reddit.com/r/malefashionadvice/search?q=This+thread+is+for+simple+style+questions+that+don%27t+warrant+their+own+thread&restrict_sr=on&sort=new&t=all")

# gets all Simple Question Threads Submission IDs via selenium and stores them in the global submissionIDs array
# def getSubmissionIDs():
# 	page = 1;

# 	while True:
# 		pageOfURLs = driver.find_elements_by_partial_link_text("Simple Questions - ")

# 		for urlObject in pageOfURLs:
# 			ID = urlObject.get_attribute("href")[52:58]
# 			submissionIDs.append(ID)

# 		f = open('out.txt', 'w')
# 		f.write(driver.current_url + "   " + str(page) + "\n")
# 		print driver.current_url + "   " + str(page)
# 		f.close()

# 		time.sleep(randint(10,12))

# 		for item in submissionIDs:
# 			print item

# 		try: 
# 			page += 1
# 			button = driver.find_element_by_partial_link_text("next")
# 			button.click()
# 			print "yes"
# 		except NoSuchElementException:
# 			print "no"
# 			break

def generateSolrID(postID, commentID):
	return str(postID) + str(commentID)

# gets comment and permalink data, feeds into solr
def feedToSolr():

	solr = pysolr.Solr('http://ec2-54-218-82-0.us-west-2.compute.amazonaws.com:8983/solr/core1', timeout=10)

	commentNumber = 0
	threadNumber = 0

	for ID in submissionIDs:
		submission = r.get_submission(submission_id=ID)
		commentList = praw.helpers.flatten_tree(submission.comments)

		print("new thread")

		for comment in commentList:
			if hasattr(comment, 'body'):
				if not comment.author:
					print("deleted comment")
				else:
					username = comment.author.name
					solrID = generateSolrID(ID,comment.permalink[:10])
					threadDate = datetime.datetime.fromtimestamp(submission.created).strftime("%B %d, %Y")
					document = [{
							"_version_":0,
							"id":solrID,
							"url":comment.permalink,
							"text":comment.body,
							"date":threadDate,
							"user":username
					        }]
					solr.add(document)
					commentNumber += 1
					print("documents added: " + str(commentNumber))

		threadNumber += 1
		print("threads processed: " + str(threadNumber))


def main():
	getSubmissionIDs()
	feedToSolr()

if __name__ == '__main__':
    main()

