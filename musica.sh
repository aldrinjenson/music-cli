#! /bin/sh
# Created on 23/11/21
# Script to download music of your choice

songName=${1-'sky full of stars'}
node index.js $songName
