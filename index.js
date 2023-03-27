
const http = require('http')
const fs = require('fs')
const WebSocket = require('ws')


const PORT = 8080;
const wss = new WebSocket.Server({port:3002})

var rooms = []
var id = 0


wss.on('connection', function connection(ws, req) {
  id++
  ws.id = id

  console.log(wss.id)

  ws.on('open', () => {  console.log("Connection opened") })

  
  ws.on('message', (data) => {
    if(data.room){
      if(!rooms[data.room].includes(ws))
        rooms[data.room].push(ws)

      console.log(rooms)
      wss.clients.forEach(function each(client) {
        if (client != ws && client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
          console.log(`Data sent by client: ${data}`)
        }
      })
    }
  })

    ws.on('close', () => { 
      console.log("Connection closed") 

      rooms.forEach( (room) => {
        room = myArray.filter(function( obj ) {
          return obj.field !== 'money';
        });
      });
      })
  })


//mounting http server for index.html
fs.readFile('./index.html',function(error,html){
  if(error) throw error;
  http.createServer(function(request, response){
    response.writeHead(200,{ 'Content-Type':'text/html'});
    response.write(html);
    response.end();
  }).listen(PORT);
});



