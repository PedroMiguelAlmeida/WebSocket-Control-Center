"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const rooms_1 = __importDefault(require("./classes/rooms"));
const jsonschema_1 = require("jsonschema");
const routes_1 = __importDefault(require("./routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const mongo_url = "mongodb://127.0.0.1:27017/wsManager";
const validator = new jsonschema_1.Validator();
const rooms2 = new rooms_1.default({});
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api", (0, routes_1.default)());
server.listen(8080, () => {
    console.log("Api listening on :8080");
});
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(mongo_url);
mongoose_1.default.connection.on("error", (error) => {
    console.log(error);
});
//# sourceMappingURL=index.js.map