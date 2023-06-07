"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const websocket_1 = require("./services/websocket");
const app = (0, express_1.default)();
const mongo_url = "mongodb://127.0.0.1:27017/wsManager";
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(mongo_url);
mongoose_1.default.connection.on("error", (error) => {
    console.log(error);
});
dotenv_1.default.config();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api", (0, routes_1.default)());
const server = http_1.default.createServer(app);
(0, websocket_1.startWSServer)(server);
server.listen(process.env.PORT, () => {
    console.log(`Server listening in ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map