#!/bin/bash
for i in {8000..9000};
	#do (exec 2>&-; echo > /dev/tcp/localhost/$i && echo $i > ~/.config/nodeiosport.cfg);
	do
	#echo $i
	STR1=$(netstat -na | grep :$i)
	#echo $STR1
	if [ ! -z "$STR1" ]; then
   		#echo "hi, I am not empty"
		STR2="$STR1"
	else
		#echo "$i"
		echo "$i" > ~/.config/nodeiosport.cfg
		break;
	fi
done
