#!/bin/bash

rm Test/out*

index=1
for test in `ls Test | sort`
do
	echo "$test -> out$index.json"
	node index.js Test/$test > Test/out$index.json
	index=$[ $index + 1 ]
done
