#!/bin/bash

echo "Current Directory Structure:"
pwd
ls -R

echo "\nNode Version:"
node --version

echo "\nNPM Version:"
npm --version

echo "\nChecking backend server.js location:"
find . -name "server.js"

echo "\nChecking package.json contents:"
cat package.json