
const http = require('http')
const fs = require('fs')
const WebSocket = require('ws')


const PORT = 8080;
const wss = new WebSocket.Server({port:3002})

var rooms = [{room : "room1", clients: []}]
var id = 0


wss.on('connection', function connection(ws, req) {
  id++
  ws.id = id

  console.log("id - "+ws.id)

  ws.on('open', () => {  console.log("Connection opened") })

  
  ws.on('message', (data)  => {
    let dataObj = null

    try{
      dataObj = JSON.parse(data);
    
      if(!dataObj.room){
        ws.send("Error - room not set!");
        throw "Error - room not set!"
      }

      var room = rooms.find(obj => { return obj.room === dataObj.room })
      if(room){
        room.clients = room.clients || []
        var client = room.clients.find(obj => { return obj === ws })
        if(!client){
          room.clients.push(ws)
          broadcast(room, ws, "Client joined room!!")
        }
      }else{
        rooms.push({ room : dataObj.room, clients : [ws] })
        room = { room : dataObj.room, clients : [ws] }
      }

      broadcast(room, ws, dataObj.data)
      ws.send("Success - msg sent to room!");
    }
    catch(error){
      console.error(error);
    }
    
  })

    ws.on('close', () => {
      console.log("Connection closed - Client "+ws.id) 

      rooms.forEach((room) => {
        room.clients = room.clients.filter(function( obj ) {
            return obj.id !== ws.id;
        });
      });

      console.log("Client "+ws.id+" removed from all rooms");
    })
  })

  function broadcast(room, msgClient, msg){
    room.clients.forEach(function each(client) {
      if (client != msgClient && client.readyState === WebSocket.OPEN) {
        client.send(msg);
        console.log("Data sent to client:"+msg.toString());
      }
    })
  }


//mounting http server for index.html
fs.readFile('./index.html',function(error,html){
  if(error) throw error;
  http.createServer(function(request, response){
    response.writeHead(200,{ 'Content-Type':'text/html'});
    response.write(html);
    response.end();
  }).listen(PORT);
});



