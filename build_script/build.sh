#!/usr/bin/sh

rm -rf dist

npx tsc

cp -r src/view dist
