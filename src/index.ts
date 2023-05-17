import express from "express"
import { createServer } from "http"
import cookieParser from "cookie-parser"
import cors from "cors"
import Rooms2 from "./classes/rooms"
import { Schema, Validator } from "jsonschema"
import router from "./routes"
import mongoose from "mongoose"
import dotenv from "dotenv"
import * as wsServer from "./services/websocket"

const app = express()
const server = createServer(app)
const mongo_url = "mongodb://127.0.0.1:27017/wsManager"

const validator = new Validator()
const rooms2 = new Rooms2({})

//Api
dotenv.config()
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use("/api", router())

server.listen(8080, () => {
	console.log("Api listening on :8080")
})

//Db
//connectToDb();
mongoose.Promise = Promise
mongoose.connect(mongo_url)
mongoose.connection.on("error", (error: Error) => {
	console.log(error)
})

//Ws
wsServer.wsStart()
/*
const wss = new WebSocketServer({ port: 3001 });
console.log("Server listening on :3001");

let id: number = 0;

interface clientData {
  type: string;
  roomName: string;
  payload: {
    msg: string;
  };
}

wss.on("connection", function connection(ws: any) {
  id++;
  ws.id = id;

  console.log("id - " + ws.id);

  ws.on("open", () => {
    console.log("Connection opened");
  });

  ws.on("message", (dataString: any) => {
    try {
      let jsonObj = JSON.parse(dataString);
      let data = jsonObj as clientData;

      //if room does not exist, create it
      rooms2.addClient(data.roomName, ws);

      let schema = rooms2.getRoom(data.roomName).schema;
      if (schema) {
        //check if client data is acording to schema
        let validateResolve = validator.validate(
          data.payload.msg,
          schema as Schema
        );
        if (!validateResolve.valid) {
          ws.send(
            JSON.stringify({
              type: "error",
              room: data.roomName,
              payload: { msg: "Message format is not valid!!" },
            })
          );
          throw "Error - validation failed room schema check";
        }
      }

      console.log(
        rooms2.getRoom(data.roomName).clients.length +
          " clients in room " +
          data.roomName
      );

      rooms2.broadcast(data.roomName, data, ws);
      console.log("Success - msg sent to room!");
    } catch (error) {
      console.error(error);
    }
  });

  ws.on("close", () => {
    console.log("Connection closed - Client " + ws.id);

    rooms2.removeClientFromAllRooms(ws);

    console.log(rooms2.getRoom("room1").clients.length + " clients in room 1");
    console.log(`Client ${ws.id} removed from all rooms`);
  });
});

*/
