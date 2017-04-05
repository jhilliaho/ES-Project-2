#!/bin/bash

npm run build

rm -rf ../server/static
rm -rf ../server/templates

mkdir ../server/static
mkdir ../server/templates

cp build/*.html ../server/templates/
cp -r build/static/* ../server/static/

#python ../server/application.py
