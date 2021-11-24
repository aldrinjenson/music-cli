#! /bin/sh
# Created on 23/11/21
# Script to download music of your choice

songName="$@"
echo $songName
node index.js $songName
