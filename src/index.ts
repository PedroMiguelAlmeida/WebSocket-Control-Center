import express from "express"
import http from "http"
import cookieParser from "cookie-parser"
import cors from "cors"
import router from "./routes"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { startWSServer } from "./services/websocket"
import { IUser } from "./models/user"
import { resolve } from "path"

declare global {
	namespace Express {
		interface Request {
			user?: IUser
		}
	}
}

const app = express()
const mongo_url = "mongodb://127.0.0.1:27017/wsManager"
dotenv.config()

//Db
//connectToDb();
mongoose.Promise = Promise
mongoose.connect(mongo_url)
mongoose.connection.on("error", (error: Error) => {
	console.log(error)
})

//Api
app.get("/", (req, res, next) => {
	res.sendFile(resolve(__dirname, "../index.html"))
})
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use("/api", router())

const server = http.createServer(app)

startWSServer(server)

server.listen(process.env.PORT, () => {
	console.log(`Server listening in ${process.env.PORT}`)
})
