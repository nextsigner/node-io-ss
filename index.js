const {Server} = require('net')
const PORT = process.env.PORT || 3111;
const HOST = process.env.HOST || '192.168.1.48';//'localhost';
var DEBUG = false;
for(var i=0;i<process.argv.length;i++){
    let arg=process.argv[i]
    if(arg.indexOf('debug')>=0)DEBUG=true
}

const connectedSockets = new Set();

// broadcast to all connected sockets except one
connectedSockets.broadcast = function(data, except) {
    for (let sock of this) {
        if (sock !== except) {
            sock.write(data);
        }
    }
}

const server = new Server(socket=> {

  if(DEBUG)console.log('client connected')
  connectedSockets.add(socket);
  socket.setKeepAlive(true);
  socket.on('end', function() {
    connectedSockets.delete(socket);
  });
  socket.on('data', function(data) {
      console.log('Server received');
      connectedSockets.broadcast(data, socket);
  });
  server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(function () {
        server.close();
        server.listen(PORT, HOST);
      }, 1000);
    }
  });
  process.stdin.on('data', data => {
    let dataWrited=`${data.toString()}`
    dataWrited=dataWrited.substring(0,dataWrited.length-1);
    let json={};
    json.from='node-io-ss';
    json.to='all';
    json.data=dataWrited//`${data.toString()}`;
    let m0=(json.data).split(' ');
    if(m0.length>1 && m0[0].indexOf('to:')===0){
        let m1=m0[0].split('to:');
        json.to=m1[1];
        json.data=m0[1];
    }
    let ds=JSON.stringify(json, null, 2)
    //console.log('Enviando: '+ds)
    socket.write(ds);
    //process.exit();
  });

  // Attach listeners for the socket
  socket.on('data', message => {
    //console.log('message')
    if(DEBUG)console.log('message: '+message)

    // Write back to the client
    let json=JSON.parse(message)
    if(DEBUG)console.log('console: from: ['+json.from+']')
    if(DEBUG)console.log('console: to: ['+json.to+']')
    if(DEBUG)console.log('console: data: ['+json.data+']')
    socket.write(JSON.stringify(json))
    /*let cfrom=json.from
    let cto=json.to
    if(json.to==='node-io-ss' && json.data.indexOf('conn_')>=0){
        json.data='Conección registrada.'
        socket.write(JSON.stringify(json))
    }else if(json.to==='all'){
        socket.write(JSON.stringify(json))
    }else{
        json.from=cto
        json.to=cfrom
        socket.write(JSON.stringify(json))
    }*/
  })

  // Send the client a message to disconnect from the server after a minute
  let json={};
  json.from='node-io-ss';
  json.to='all';
  json.data='disconnect';
  //setTimeout(() => socket.write(JSON.stringify(json, null, 2)), 60000)

  if(DEBUG)socket.on('end', () => console.log('client disconnected'))
})

server.listen(PORT, HOST, () => console.log('Conectado en '+HOST+':'+PORT))



