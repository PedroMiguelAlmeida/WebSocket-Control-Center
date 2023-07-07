import { IncomingMessage, ServerResponse } from "http"
import { WebSocketServer } from "ws"
import * as Topic from "../services/topics"
import * as Namespace from "../services/namespaces"
import { INamespace, ITopic } from "../models/namespace"
import { Types } from "mongoose"
import { isAuth, loginUser } from "./auth"

interface IClientData {
	type: string
	namespace: string
	topicName: string
	payload: {
		msg: string
	}
}

export interface IMessageData {
	type: string
	payload: {
		id: string
		msgDate: Date
		username: string
		msg: string
	}
}

export var wsClientList: { [id: string]: any } = {}
const HEARTBEAT_INTERVAL = 1000 * 5 // 5 seconds
const HEARTBEAT_VALUE = 1

export function startWSServer(server: any) {
	const wss = new WebSocketServer({ server })
	console.log("WS Server start")
	wss.on("connection", async function connection(ws: any, req: IncomingMessage) {
		try {
			ws.isAlive = true
			const user = await wsLogin(req)

			if (!user._id) throw new Error("User not found")

			ws.userId = user._id
			wsClientList[user._id] = ws

			ws.on("open", () => {
				console.log("Connection opened")
			})

			console.log("Client connected: " + user._id + " - " + user.username)

			ws.on("message", async (msg: string, isBinary: any) => {
				try {
					if (isBinary && (msg as any)[0] === HEARTBEAT_VALUE) {
						ws.isAlive = true
						return
					}
					let data = JSON.parse(msg)
					if (!data.namespace) throw new Error("namespace required")

					switch (data.type) {
						case "message":
							let clients
							if (data.topicName) {
								const namespace = await Topic.getTopicByNameUnpop(data.namespace, data.topicName)
								const topic = namespace.topics[0]
								if (topic.topicSchema) {
									const valid = Topic.validateSchemaData(JSON.parse(topic.topicSchema), data.payload.msg)
									if (!valid) throw new Error("Data does not match the topic schema!")
								}
								clients = topic.clients
							} else {
								clients = await Namespace.getNamespaceClients(data.namespace)
							}
							if (!clients) throw new Error("No clients found!")
							ws.send(JSON.stringify({ type: "success", payload: { msg: "Msg sent!" } }))
							broadcast(clients, user, data.payload.msg, "message")
							break
						case "sub-topic":
							if (!data.topicName) throw new Error("topicName required")
							Topic.addClientToTopic(data.namespace, data.topicName, user._id).then((topic: ITopic) => {
								ws.send(JSON.stringify({ type: "success", payload: { msg: "You subed to topic - " + data.topicName } }))
								broadcast(topic.clients, user, "Client " + user._id + " subed to topic - " + data.topicName, "sub")
							})
							break
						case "unsub-topic":
							if (!data.topicName) throw new Error("topicName required")
							Topic.removeClientFromTopic(data.namespace, data.topicName, user._id).then((topic: ITopic) => {
								ws.send(JSON.stringify({ type: "success", payload: { msg: "You unsubed from topic - " + data.topicName } }))
								broadcast(topic.clients, user, "Client " + user._id + " unsubed from topic - " + data.topicName, "unsub")
							})
							break
						case "sub-namespace":
							Namespace.addClientToNamespace(data.namespace, user._id).then((namespace: INamespace) => {
								ws.send(JSON.stringify({ type: "success", payload: { msg: "You subed to namespace - " + data.namespace } }))
								broadcast(namespace.clients, user, "Client " + user._id + " subed to namespace - " + data.namespace, "sub")
							})
							break
						case "unsub-namespace":
							Namespace.removeClientFromNamespace(data.namespace, user._id).then((namespace: INamespace) => {
								ws.send(JSON.stringify({ type: "success", payload: { msg: "You unsubed from namespace - " + data.namespace } }))
								broadcast(namespace.clients, user, "Client " + user._id + " unsubed from namespace - " + data.namespace, "unsub")
							})
							break
						case "startTest":
							const start = performance.now()
							console.log("startTime: ", start)
							if (!data.topicName) throw new Error("topicName required")
							if (!data.payload.msg) throw new Error("nrTests required")
							const nrTests = data.payload.msg
							for (let i = 0; i < nrTests; i++) {
								await runTest(data.namespace, data.topicName, data.payload.msg)
							}
							const time = ((performance.now() - start) / 1000).toFixed(2)
							console.log("time: ", time)
							const ns = await Topic.getTopicByNameUnpop(data.namespace, data.topicName)
							ws.send(
								JSON.stringify({
									type: "success",
									payload: {
										msg: "Test finished! - " + time + " sec to send " + nrTests + " messenges to " + ns.topics[0].clients.length + " users",
									},
								})
							)
							break
						case "endTest":
							break
						default:
							throw new Error("Message type not recognised!")
					}
				} catch (err: any) {
					console.error(err)
					ws.send(JSON.stringify({ type: "error", payload: { msg: "Error - msg not sent!", err: err.message } }))
				}
			})

			ws.on("close", () => {
				console.log("Connection closed - Client " + ws.id)
				delete wsClientList[ws.id]
				//clearInterval(interval)
			})
		} catch (err: any) {
			console.error(err)
			ws.send(JSON.stringify({ type: "error", payload: { msg: "Error - something went wrong!", err: err.message } }))
			ws.close()
		}
	})
	/*
	const interval = setInterval(() => {
		// console.log('firing interval');
		
		wss.clients.forEach((ws: any) => {
			if (!ws.isAlive) {
				ws.terminate()
				return
			}

			ws.isAlive = false
			ping(ws)
		})
	}, HEARTBEAT_INTERVAL)*/
}

const wsLogin = async (req: any) => {
	const cookies = parseCookies(req.headers.cookie)
	if (cookies["WS-MANAGER-AUTH"]) return await isAuth(cookies["WS-MANAGER-AUTH"])
	else if (cookies["WS-MANAGER-LOGIN"]) {
		let buff = Buffer.from(cookies["WS-MANAGER-LOGIN"], "base64").toString("ascii")
		let [email, password] = buff.split(":")
		const token = await loginUser(email, password)
		return await isAuth(token)
	} else {
		throw new Error("Not authorized")
	}
}

function parseCookies(cookieHeader?: string): { [key: string]: string } {
	const cookies: { [key: string]: string } = {}

	if (cookieHeader) {
		const cookieArray = cookieHeader.split(";")
		for (const cookie of cookieArray) {
			const [name, value] = cookie.trim().split("=")
			cookies[name] = decodeURIComponent(value)
		}
	}

	return cookies
}

export const broadcast = (clients: Types.Array<Types.ObjectId>, sender: any, msg: any, msgType: string) => {
	const msgData: IMessageData = { type: msgType, payload: { id: "", msgDate: new Date(), username: sender.username, msg: msg } }
	clients.forEach((client) => {
		const c = client.toString()
		if (wsClientList[c] && c !== sender.id && wsClientList[c].readyState === 1) wsClientList[c].send(JSON.stringify(msgData))
	})
}

export const ping = (ws: any) => {
	ws.send(HEARTBEAT_VALUE, { binary: true })
	console.log("ping")
}

async function runTest(namespace: string, topicName: string, msg: any) {
	const ns = await Topic.getTopicByNameUnpop(namespace, topicName)
	broadcast(ns.topics[0].clients, "", msg, "message")
}
