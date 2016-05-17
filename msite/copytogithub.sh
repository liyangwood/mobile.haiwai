#!/usr/bin/env bash

FROM=${PWD};
TO=/Users/JackyLee/Desktop/haiwai.inc/haiwai/m;


copyRes(){
	DIR="$1"
	echo $DIR;
	rm -rf ${TO}/$DIR;
	cd ${TO};
	mkdir $DIR;
	cd ${FROM};
	\cp -fr ${FROM}/../$DIR ${TO};
}

copyFile(){
	DIR="$1"
	echo $DIR;
	rm -rf ${TO}/$DIR;
	cd ${TO};
	mkdir $DIR;
	cd ${FROM};
	\cp -fr ${FROM}/$DIR ${TO};
}

cd ${TO}
git pull
cd ${FROM}

echo "---- start copy file ----";
gulp pub;
copyRes lib;
copyRes bothjs
copyRes bothtpl
copyRes img

copyFile page
copyFile dist


cd ${TO}
git add .
git commit -m 'update file from jacky github depot'
git push
cd ${FROM}