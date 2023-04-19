import express from "express"
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import Rooms from './classes/rooms.js'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ port: 3001 })

app.use(bodyParser.json())

app.post('/schema', (req, res) => {
  try {
    let schema = req.body.schema
    let roomName = req.body.room

    if(schema.$schema !== 'https://json-schema.org/draft/2020-12/schema')
      throw 'Schema is not valid!';
    
    rooms.addRoom(roomName, { clients: [], schema: schema })
    
    res.send('Schema saved!')
  } catch (err) {
    res.status(400).send(err)
  }
})



// import roomSchema from './schemas/single_schemas/room.schema.json'
// import dataSchema from './schemas/single_schemas/data.schema.json'
// import schema from './schemas/composite_schemas/final.schema.json'


// validator.addSchema(schema,'/final')
// validator.addSchema(roomSchema,'/room')
// validator.addSchema(dataSchema,'/data')

// var Validator = require('jsonschema').Validator;
// var validator = new Validator();

const rooms = new Rooms({})
let id:number = 0

interface clientData {
  roomName: string
  payload: {
    msg: string
  }
}


wss.on('connection', function connection(ws: any) {
  id++
  ws.id = id

  console.log("id - " + ws.id)

  ws.on('open', () => { console.log("Connection opened") })


  ws.on('message', (dataString: any) => {
    try {
      let jsonObj  = JSON.parse(dataString);
      let data = jsonObj as clientData;
/*
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
      }*/

      //room logic
      if (rooms.roomExists(data.roomName)) {
        rooms.addClient(data.roomName, ws);
      } else {
        rooms.addRoom(data.roomName, { clients: [ws], schema: null });
      }
      console.log(rooms.getRoom(data.roomName).clients.length + " clients in room " + data.roomName);

      rooms.broadcast(data.roomName, data, ws)
      console.log("Success - msg sent to room!");
    }
    catch (error) {
      console.error(error);
    }

  })

  ws.on('close', () => {
    console.log("Connection closed - Client " + ws.id)

    rooms.removeClientFromAllRooms
    
    console.log("Client " + ws.id + " removed from all rooms");

  })
})

server.listen(8080, () => { console.log('Listening on :3000') })