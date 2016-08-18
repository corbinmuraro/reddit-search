import praw
import sys

r = praw.Reddit(user_agent="simplequestions_search")
submission = r.get_submission(submission_id='4bcusn')
submission.replace_more_comments(limit=None, threshold=0)
flat_comments = praw.helpers.flatten_tree(submission.comments)

with open("file.dat","a+") as f:
	for comment in flat_comments:
		f.write(comment.body)