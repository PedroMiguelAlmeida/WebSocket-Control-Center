"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const ws_1 = require("ws");
<<<<<<< HEAD
const rooms_js_1 = __importDefault(require("./classes/rooms.js"));
=======
const rooms_js_1 = __importDefault(require("./models/rooms.js"));
const rooms_js_2 = __importDefault(require("./classes/rooms.js"));
const topics_js_1 = __importDefault(require("./models/topics.js"));
>>>>>>> 01ec8a9d6b169490204cb55351d139955341c6fa
const jsonschema_1 = require("jsonschema");
const db_js_1 = require("./db.js");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const validator = new jsonschema_1.Validator();
<<<<<<< HEAD
const rooms2 = new rooms_js_1.default({});
(0, db_js_1.connectToDb)();
app.use(body_parser_1.default.json());
app.use('/', (0, routes_1.default)());
=======
const roomsModel = new rooms_js_1.default();
const topicsModel = new topics_js_1.default();
const rooms2 = new rooms_js_2.default({});
(0, db_js_1.connectToDb)();
app.use(body_parser_1.default.json());
app.get("/rooms", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Api get rooms");
    let rooms = yield roomsModel.getRoom("room1");
    res.status(200).send(rooms);
}));
app.get("/topics/:topicName", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let topicName = _req.params.topicName;
    console.log("Api get topic");
    let topics = yield topicsModel.getTopic(topicName);
    res.status(200).send(topics);
}));
app.get("/topics", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let topics = yield topicsModel.getAllTopics();
    res.status(200).send(topics);
}));
app.put("/uploadTopicSchema/:topicName", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let topicName = _req.params.topicName;
    let schema = _req.body.schema;
    let uploadedSchemaRes = yield topicsModel.uploadTopicSchema(topicName, schema);
    res.status(200).send(uploadedSchemaRes);
}));
app.delete("/deleteTopic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let topicName = req.body.topicName;
    topicsModel.deleteTopic(topicName);
    res.send("Topic deleted");
}));
app.post("/addTopic", (req, res) => {
    try {
        let roomName = req.body.roomName;
        let topicName = req.body.topicName;
        topicsModel.addTopic(roomName, topicName);
        res.send("Topic saved!");
    }
    catch (err) {
        res.status(400).send(err);
    }
});
app.post("/schema", (req, res) => {
    try {
        let schema = req.body.schema;
        let roomName = req.body.roomName;
        if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema")
            throw "Schema is not valid!";
        rooms2.addSchema(roomName, schema);
        res.send("Schema saved!");
    }
    catch (err) {
        res.status(400).send(err);
    }
});
>>>>>>> 01ec8a9d6b169490204cb55351d139955341c6fa
const wss = new ws_1.WebSocketServer({ port: 3001 });
console.log("Server listening on :3001");
let id = 0;
wss.on("connection", function connection(ws) {
    id++;
    ws.id = id;
    console.log("id - " + ws.id);
    ws.on("open", () => {
        console.log("Connection opened");
    });
    ws.on("message", (dataString) => {
        try {
            let jsonObj = JSON.parse(dataString);
            let data = jsonObj;
            rooms2.addClient(data.roomName, ws);
            let schema = rooms2.getRoom(data.roomName).schema;
            if (schema) {
                let validateResolve = validator.validate(data.payload.msg, schema);
                if (!validateResolve.valid) {
                    ws.send(JSON.stringify({
                        type: "error",
                        room: data.roomName,
                        payload: { msg: "Message format is not valid!!" },
                    }));
                    throw "Error - validation failed room schema check";
                }
            }
            console.log(rooms2.getRoom(data.roomName).clients.length +
                " clients in room " +
                data.roomName);
            rooms2.broadcast(data.roomName, data, ws);
            console.log("Success - msg sent to room!");
        }
        catch (error) {
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
server.listen(8080, () => {
    console.log("Api listening on :8080");
});
//# sourceMappingURL=index.js.map