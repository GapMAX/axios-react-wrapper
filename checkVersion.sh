#!/bin/sh
moduleVersion=$(cat package.json | grep version | awk -F '"' '{print $4}');
if [ -f version.temp ];then
  oldVersion=$(cat version.temp)
  if [ $oldVersion = $moduleVersion ];then
    echo
    echo Please update package.json version.
    echo
    exit 1
  else
    echo $moduleVersion > version.temp;
  fi;
else
  echo 0 > version.temp
fi;