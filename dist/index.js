"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const ws_1 = require("ws");
const rooms_js_1 = __importDefault(require("./classes/rooms.js"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ port: 3001 });
app.use(body_parser_1.default.json());
app.post('/schema', (req, res) => {
    try {
        let schema = req.body.schema;
        let roomName = req.body.roomName;
        if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema')
            throw 'Schema is not valid!';
        rooms.addSchema(roomName, schema);
        res.send('Schema saved!');
    }
    catch (err) {
        res.status(400).send(err);
    }
});
console.log("Server listening on :3001");
let roomSchema = require('./schemas/single_schemas/room.schema.json');
let dataSchema = require('./schemas/single_schemas/data.schema.json');
const jsonschema_1 = require("jsonschema");
var validator = new jsonschema_1.Validator();
const globalSchema = {
    "$id": "/final",
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "required": ["room", "payload"],
    "properties": {
        "room": {
            "description": "Room Name",
            "type": "string",
            "minLength": 4
        },
        "payload": {
            "type": "object",
            "required": ["msg"],
            "properties": {
                "msg": {
                    "description": "Data",
                    "type": "object"
                }
            }
        }
    }
};
validator.addSchema(roomSchema, '/room');
validator.addSchema(dataSchema, '/data');
const rooms = new rooms_js_1.default({});
let id = 0;
wss.on('connection', function connection(ws) {
    id++;
    ws.id = id;
    console.log("id - " + ws.id);
    ws.on('open', () => { console.log("Connection opened"); });
    ws.on('message', (dataString) => {
        try {
            let jsonObj = JSON.parse(dataString);
            let data = jsonObj;
            rooms.addClient(data.roomName, ws);
            let schema = rooms.getRoom(data.roomName).schema;
            if (schema) {
                let validateResolve = validator.validate(data.payload.msg, schema);
                if (!validateResolve.valid) {
                    ws.send(JSON.stringify({ "type": "error", "room": data.roomName, "payload": { "msg": "Message format is not valid!!" } }));
                    throw "Error - validation failed room schema check";
                }
            }
            console.log(rooms.getRoom(data.roomName).clients.length + " clients in room " + data.roomName);
            rooms.broadcast(data.roomName, data, ws);
            console.log("Success - msg sent to room!");
        }
        catch (error) {
            console.error(error);
        }
    });
    ws.on('close', () => {
        console.log("Connection closed - Client " + ws.id);
        rooms.removeClientFromAllRooms;
        console.log(rooms.getRoom("room1").clients.length + " clients in room 1");
        console.log("Client " + ws.id + " removed from all rooms");
    });
});
server.listen(8080, () => { console.log('Api listening on :8080'); });
//# sourceMappingURL=index.js.map