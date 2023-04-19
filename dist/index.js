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
        let roomName = req.body.room;
        if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema')
            throw 'Schema is not valid!';
        rooms.addRoom(roomName, { clients: [], schema: schema });
        res.send('Schema saved!');
    }
    catch (err) {
        res.status(400).send(err);
    }
});
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
            if (rooms.roomExists(data.roomName)) {
                rooms.addClient(data.roomName, ws);
            }
            else {
                rooms.addRoom(data.roomName, { clients: [ws], schema: null });
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
        console.log(rooms.getRoom("room1").clients.length + " clients in room " + "room1");
        console.log("Client " + ws.id + " removed from all rooms");
    });
});
server.listen(8080, () => { console.log('Listening on :3000'); });
//# sourceMappingURL=index.js.map