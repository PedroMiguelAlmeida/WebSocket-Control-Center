


import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import Rooms from './classes/rooms.mjs'

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ port: 3001 });

const rooms = new Rooms();

// import roomSchema from './schemas/single_schemas/room.schema.json'
// import dataSchema from './schemas/single_schemas/data.schema.json'
// import schema from './schemas/composite_schemas/final.schema.json'


// validator.addSchema(schema,'/final')
// validator.addSchema(roomSchema,'/room')
// validator.addSchema(dataSchema,'/data')

let id = 0

let sentDataHistory = new Array();


// var Validator = require('jsonschema').Validator;
// var validator = new Validator();


app.use(bodyParser.json());

app.post('/schema', (req, res) => {
  try {
    let schema = req.body.schema;
    let roomName = req.body.room;

    if(schema.$schema !== 'https://json-schema.org/draft/2020-12/schema')
      throw 'Schema is not valid!';
    
    rooms.addSchema(roomName, schema);
    
    res.send('Schema saved!')
  } catch (err) {
    res.status(400).send(err);
  }
})

wss.on('connection', function connection(ws, req) {
  id++
  ws.id = id

  console.log("id - " + ws.id)

  ws.on('open', () => { console.log("Connection opened") })


  ws.on('message', (data) => {
    let dataObj = null

    try {
      dataObj = JSON.parse(data);

      let validateResolve = validator.validate(dataObj,schema);
      if (!validateResolve.valid) {
        ws.send(JSON.stringify({
          "type": "error",
          "room": dataObj.room,
          "payload": {
            "msg": "Message format is not valid!!"
          }
        }))
        throw "Error - validation failed";
      }

      //room logic
      var room = rooms.find(obj => { return obj.room === dataObj.room })
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

server.listen(8080, () => { console.log('Listening on :3000') })