
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const { receiveMessageOnPort } = require('worker_threads');


const PORT = 8080;

const wss = new WebSocket.Server({port:3002});

let sentDataHistory = new Array();

wss.on('connection', function connection(ws){
    //console.log(`Length before sending a new message ${sentDataHistory.length}`);
    ws.on('message', function incoming(data) {
      sentDataHistory.push(data);
      //console.log(`Data history: ${sentDataHistory.toString()}`);
      //console.log(`Length after sending a new message ${sentDataHistory.length}`);
      if (sentDataHistory.length == 1) {
        //console.log("Esta é a primeira mensagem");
        // function to create schema based on this message;
      }
      wss.clients.forEach(function each(client) {
        //console.log(wss.clients) //Shows SET data structure which wss uses to store every ws
        if (client != ws && client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
          console.log(`Data sent by client: ${data}`)
        }
      })
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
