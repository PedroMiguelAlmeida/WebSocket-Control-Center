import express from "express"
import { createServer } from "http"
import cookieParser from "cookie-parser"
import cors from "cors"
import router from "./routes"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { wss } from "./services/websocket"
import session from "express-session"

const app = express()
const server = createServer(app)
const mongo_url = "mongodb://127.0.0.1:27017/wsManager"

//Api
dotenv.config()
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(express.json())

const sessionParser = session({
	saveUninitialized: false,
	secret: process.env.JWT_SECRET as string,
	resave: false,
	cookie: {},
})
app.use(sessionParser)

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
server.on("upgrade", (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (ws) => {
		wss.emit("connection", ws, request)
	})
})
