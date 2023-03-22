
const http = require('http');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port:3002});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
      wss.clients.forEach(function each(client) {
       console.debug(data)
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      })
    })
  })

