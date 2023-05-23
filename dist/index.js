"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const websocket_1 = require("./services/websocket");
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const mongo_url = "mongodb://127.0.0.1:27017/wsManager";
dotenv_1.default.config();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const sessionParser = (0, express_session_1.default)({
    saveUninitialized: false,
    secret: process.env.JWT_SECRET,
    resave: false,
    cookie: {},
});
app.use(sessionParser);
app.use("/api", (0, routes_1.default)());
server.listen(8080, () => {
    console.log("Api listening on :8080");
});
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(mongo_url);
mongoose_1.default.connection.on("error", (error) => {
    console.log(error);
});
server.on("upgrade", (request, socket, head) => {
    websocket_1.wss.handleUpgrade(request, socket, head, (ws) => {
        websocket_1.wss.emit("connection", ws, request);
    });
});
//# sourceMappingURL=index.js.map