import express from "express"
import * as http from "http"
import cookieParser from "cookie-parser"
import cors from "cors"
import router from "./routes"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { startWSServer } from "./services/websocket"

const app = express()
const server = http.createServer(app)
const mongo_url = "mongodb://127.0.0.1:27017/wsManager"

//Db
//connectToDb();
mongoose.Promise = Promise
mongoose.connect(mongo_url)
mongoose.connection.on("error", (error: Error) => {
	console.log(error)
})

//Api
dotenv.config()
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use("/api", router())

startWSServer(server)

server.listen(process.env.PORT, () => {
	console.log(`Server listening in ${process.env.PORT}`)
})
