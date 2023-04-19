

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const server = require('http').createServer(app);
const Websocket = require('ws');

const wss = new Websocket.Server({ port: 3002 })
console.log("Server listening on :3001")
let roomSchema = require('./schemas/single_schemas/room.schema.json')
let dataSchema = require('./schemas/single_schemas/data.schema.json')

var Validator = require('jsonschema').Validator;
var validator = new Validator();

const globalSchema = {
  "$id": "/final",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["room", "payload"],
  "properties": {
    "room": {
      "description":"Room Name",
      "type":"string",
      "minLength":4
    },
    "payload": {
      "type": "object",
      "required": ["msg"],
      "properties": {
        "msg": {
          "description":"Data",
          "type":"object"
        }
      }
    }
  }
};


validator.addSchema(roomSchema, '/room')
validator.addSchema(dataSchema, '/data')

let rooms = [{ room: "room1", clients: [], schema: null }];
var id = 0

app.use(bodyParser.json());

app.post('/schema', (req, res) => {
  try {
    let schema = req.body.schema;
    let roomName = req.body.room;

    if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema')
      throw 'Schema is not valid!';

    var room = rooms.find(obj => { return obj.room === roomName })
    if (room)
      room.schema = schema;
    else
      rooms.push({ room: roomName, clients: [], schema: schema })

    res.send('Schema saved!')
  } catch (err) {
    res.status(400).send(err);
  }
})
console.log("server start");
wss.on('connection', function connection(ws, req) {
  id++
  ws.id = id

  console.log("id - " + ws.id)

  ws.on('open', () => { console.log("Connection opened") })


  ws.on('message', (data) => {
    let dataObj = null

    try {
      dataObj = JSON.parse(data);
      //validatorGlobalSchema 
      let validateResolveGlobal = validator.validate(dataObj,globalSchema)
      if (!validateResolveGlobal.valid) {
        ws.send(JSON.stringify({
          "type": "error",
          "room": dataObj.room,
          "payload": {
            "msg": "Message format is not valid!! Global schema"
          }
        }))
        throw "Error - validation failed global schema check";
      }
      var room = rooms.find(obj => { return obj.room === dataObj.room })

      //validatorRoomSchema
      let validateResolve = validator.validate(dataObj.payload.message, room.schema);
      if (!validateResolve.valid) {
        ws.send(JSON.stringify({
          "type": "error",
          "room": dataObj.room,
          "payload": {
            "msg": "Message format is not valid!!"
          }
        }))
        throw "Error - validation failed room schema check";
      }
      room = rooms.find(obj => { return obj.room === dataObj.room })

      //room logic
      if (room) {
        room.clients = room.clients || []
        var client = room.clients.find(obj => { return obj === ws })
        if (!client) {
          room.clients.push(ws)
          broadcast(room, dataObj, ws)
        }
      } else {
        room = { room: dataObj.room, clients: [ws], schema: null }
        rooms.push(room)
      }
      console.log(room)
      console.log(dataObj)
      broadcast(room, dataObj, ws)
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

function broadcast(room, dataObj, msgClient) {
  room.clients.forEach(function each(client) {
    if (client != msgClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(dataObj.payload.msg))
      console.log("Data sent to client: " + JSON.stringify(dataObj.payload.msg))
    }
  })
}

function getSupportedMessageType(message) {
  const messageType = typeof (message);
  switch (messageType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    default:
      throw new Error(`${messageType} is not supported`);
  }
}

//mounting http server for index.html
// fs.readFile('./index.html', function (error, html) {
//   if (error) throw error;
//   http.createServer(function (request, response) {
//     response.writeHead(200, { 'Content-Type': 'text/html' });
//     response.write(html);
//     response.end();
//   }).listen(PORT);
// });

server.listen(8080, () => { console.log('Listening on :8080') })