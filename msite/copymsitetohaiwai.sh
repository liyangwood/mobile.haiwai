#!/usr/bin/env bash

FROM=${PWD};
TO=~/haiwai.com/m;


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

echo "---- start copy file ----";
gulp pub;
copyRes lib;
copyRes bothjs
copyRes bothtpl
copyRes img

copyFile page
copyFile dist


cd ${TO}
svn st | awk '{if ($1 == "?") {print $2} }' | xargs svn add;
svn ci -m 'update msite file from jacky github depot';
cd ${FROM}