const {Server} = require('net')
//const s
const server = new Server(socket=> {
  console.log('client connected')
  process.stdin.on('data', data => {
    socket.write(`${data.toString()}`);
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



