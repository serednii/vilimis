#!/bin/bash

set -f        # disable globbing
IFS=$'\n'     # set field separator to NL (only)
arr=($(mysql -u root -ptů.r4vsvtů.r4v -e "USE instance;SELECT email FROM instance where passed = 0"))

for i in "${arr[@]}"
do
  if [[ ${i} != "email" ]];then
   echo "$i"
   /var/www/install/vilem-install.sh $i
fi
done