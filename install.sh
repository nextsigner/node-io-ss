#!/bin/bash
echo "Este script fué programado por nextsigner para un servidor GNU/Linux Ubuntu 20.04"
echo "Este proyecto NodeJS fué programado con la versión 14.14.0 desde nvm."
npm install forever -g
npm install forever-service -g

#For root example
#grep -qxF 'forever start /root/zool-server/index.js' /etc/rc.local || echo 'forever start /root/zool-server/index.js' >> /etc/rc.local

grep -qxF 'forever start /home/ns/nsp/node-io-ss/index.js' /etc/rc.local || echo 'forever start /home/ns/nsp/node-io-ss/index.js' >> /etc/rc.local
#For root example
#sudo forever-service install zool-server --script /root/zool-server/index.js
sudo forever-service install node-io-ss --script /home/ns/nsp/node-io-ss/index.js
sudo forever-service node-io-ss start
