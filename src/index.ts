import express from "express"
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import Rooms2  from './classes/rooms.js'
import { Schema, Validator } from 'jsonschema'
import { connectToDb, db } from './db.js'
import router from './routes'

const app = express()
const server = createServer(app)

const validator = new Validator()
const rooms2 = new Rooms2({})

//Db
  connectToDb()


//Api
app.use(bodyParser.json())

app.use('/', router())

//Ws

const wss = new WebSocketServer({ port: 3001 })
console.log("Server listening on :3001")


let id:number = 0

interface clientData {
  type: string,
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
      let jsonObj  = JSON.parse(dataString)
      let data = jsonObj as clientData

      //if room does not exist, create it
      rooms2.addClient(data.roomName, ws)
      
      let schema = rooms2.getRoom(data.roomName).schema
      if(schema){
        //check if client data is acording to schema
        let validateResolve = validator.validate(data.payload.msg, schema as Schema)
        if (!validateResolve.valid) {
          ws.send(JSON.stringify({ "type": "error", "room": data.roomName, "payload": { "msg": "Message format is not valid!!" } }))
          throw "Error - validation failed room schema check"
        }
      }

      console.log(rooms2.getRoom(data.roomName).clients.length + " clients in room " + data.roomName)

      rooms2.broadcast(data.roomName, data, ws)
      console.log("Success - msg sent to room!")
    }
    catch (error) {
      console.error(error)
    }
  })

  ws.on('close', () => {
    console.log("Connection closed - Client " + ws.id)

    rooms2.removeClientFromAllRooms(ws)
    
    console.log(rooms2.getRoom("room1").clients.length + " clients in room 1")
    console.log("Client " + ws.id + " removed from all rooms")

  })
})

server.listen(8080, () => { console.log('Api listening on :8080') })