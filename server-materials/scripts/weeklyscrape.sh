#!/bin/bash
# runs weekly python scrape of reddit SQ threads

cd ~/server-materials
source ~/server-materials/newvenv/bin/activate
python comments-to-solr.py
