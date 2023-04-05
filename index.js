

const http = require('http')
const fs = require('fs')
const WebSocket = require('ws')


const PORT = 8080;
const wss = new WebSocket.Server({ port: 3002 })

var rooms = [{ room: "room1", clients: [] }]
var id = 0

let sentDataHistory = new Array();


var Validator = require('jsonschema').Validator;
var validator = new Validator();

function getSupportedMessageType(message) {
  const messageType = typeof (message);
  switch (messageType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    // case 'integer':
    //   return 'integer';
    // case 'float': 
    //   return 'float';
    default:
      throw new Error(`${messageType} is not supported`);
  }
}


wss.on('connection', function connection(ws, req) {
  id++
  ws.id = id

  console.log("id - " + ws.id)

  ws.on('open', () => { console.log("Connection opened") })


  ws.on('message', (data) => {
    let dataObj = null

    try {
      dataObj = JSON.parse(data);

      sentDataHistory.push(dataObj);

      let schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "required": ["room", "type", "payload"],
        "properties": {
          "room": {
            "description": "Room name",
            "type": "string"
          },
          "type": {
            "description": "Payload message type",
            "type": "string"
          },
          "payload": {
            "type": "object",
            "required": ["msg"],
            "properties": {
              "user": {
                "description": "Identifies the user",
                "type": "string"
              },
              "msg": {
                "description": "the message itself",
                "type": getSupportedMessageType(sentDataHistory[0].payload.message)
              }
            }
          },
        }
      }

      let validateResolve = validator.validate(dataObj, schema);
      if (!validateResolve.valid) {
        ws.send({
          "type": "error",
          "room": dataObj.room,
          "payload": {
            "msg": "Message format is not valid!!"
          }
        })
        throw "Error - validation failed";
      }

      //room logic
      var room = rooms.find(obj => { return obj.room === dataObj.room })
      if (room) {
        room.clients = room.clients || []
        var client = room.clients.find(obj => { return obj === ws })
        if (!client) {
          room.clients.push(ws)

          let msg = {
            "type": "message",
            "room": dataObj.room,
            "payload": {
              "message": "Client joined room!!"
            }
          }
          broadcast(room, msg, ws)
        }
      } else {
        rooms.push({ room: dataObj.room, clients: [ws] })
        room = { room: dataObj.room, clients: [ws] }
      }

      broadcast(dataObj, ws)
      console.log("Success - msg sent to room!");
    }
    catch (error) {
      console.error(error);
    }

  })

  ws.on('close', () => {
    console.log("Connection closed - Client " + ws.id)

    rooms.forEach((room) => {
      room.clients = room.clients.filter(function (obj) {
        return obj.id !== ws.id;
      });
    });

    console.log("Client " + ws.id + " removed from all rooms");

  })
})

function broadcast(room, msg, msgClient) {
  room.clients.forEach(function each(client) {
    if (client != msgClient && client.readyState === WebSocket.OPEN) {
      client.send(msg);
      console.log("Data sent to client: " + msg.toString());
    }
  })
}

//mounting http server for index.html
fs.readFile('./index.html', function (error, html) {
  if (error) throw error;
  http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(html);
    response.end();
  }).listen(PORT);
});

