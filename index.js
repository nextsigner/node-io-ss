const {Server} = require('net')
//const s
const server = new Server(socket=> {
  console.log('client connected')
  process.stdin.on('data', data => {
    let dataWrited=`${data.toString()}`
    dataWrited=dataWrited.substring(0,dataWrited.length-1);
    let json={};
    json.from='node-io-ss';
    json.to='all';
    json.data=dataWrited//`${data.toString()}`;
    let m0=(json.data).split(' ');
    if(m0.length>1 && m0[0].indexOf('from:')===0){
        let m1=m0[0].split('from:');
        json.to=m1[1];
        json.data=m0[1];
    }
    let ds=JSON.stringify(json, null, 2)
    console.log('Enviando: '+ds)
    socket.write(ds);
    //process.exit();
  });

  // Attach listeners for the socket
  socket.on('data', message => {
    console.log('message')
    console.log('message: '+message)

    // Write back to the client
    socket.write('world')
  })

  // Send the client a message to disconnect from the server after a minute
  setTimeout(() => socket.write('disconnect'), 60000)

  socket.on('end', () => console.log('client disconnected'))
})

server.listen(3111, 'localhost', () => console.log('listening'))



