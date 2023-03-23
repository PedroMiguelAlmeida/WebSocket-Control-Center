
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');


const PORT = 8080;
const wss = new WebSocket.Server({port:3002});


wss.on('connection', function connection(ws) {
    console.log("Client connected")
    ws.on('message', function incoming(data) {
      wss.clients.forEach(function each(client) {
        if (client != ws && client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
          console.log(`Data sent by client: ${data}`)
        }
      })
    })
  })

fs.readFile('./index.html',function(error,html){
  if(error) throw error;
  http.createServer(function(request, response){
    response.writeHead(200,{ 'Content-Type':'text/html'});
    response.write(html);
    response.end();
  }).listen(PORT);
});


// wss.on('connection',function connection(ws) {
//   console.log("Client connected");
//   ws.on('message',data => {
//     console.log(`Client has send ${data}`);
//     if(ws.readyState == WebSocket.OPEN){
//       ws.send(data);
//     }
//   })
  
// })

