import { IncomingMessage, ServerResponse } from "http"
import { WebSocketServer } from "ws"
import * as Topic from "../services/topics"
import * as Namespace from "../services/namespaces"
import { INamespace, ITopic } from "../models/namespace"
import { Types } from "mongoose"
import { isAuth } from "./auth"

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

export function startWSServer(server: any) {
	const wss = new WebSocketServer({ server })
	console.log("WS Server start")

	wss.on("connection", async function connection(ws: any, req: IncomingMessage) {
		try {
			const cookies = parseCookies(req.headers.cookie)
			const user = await isAuth(cookies["WS-MANAGER-AUTH"])

			if (!user._id) throw new Error("User not found")

			ws.userId = user._id
			wsClientList[user._id] = ws

			ws.on("open", () => {
				console.log("Connection opened")
			})

			ws.on("message", async (message: string) => {
				try {
					let data = JSON.parse(message)

					if (!data.namespace) throw new Error("namespace required")

					switch (data.type) {
						case "message":
							let clients
							if (data.topicName && data.namespace) {
								const namespace = await Topic.getTopicByName(data.namespace, data.topicName)
								const topic = namespace.topics[0]
								if (topic.topicSchema) {
									const valid = Topic.validateSchemaData(JSON.parse(topic.topicSchema), data.payload.msg)
									if (!valid) throw new Error("Data does not match the topic schema!")
								}
								clients = topic.clients
							} else {
								clients = await Namespace.getNamespaceClients(data.namespace)
							}
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
						default:
							throw new Error("No type in data")
					}
				} catch (err: any) {
					console.error(err)
					ws.send(JSON.stringify({ type: "error", payload: { msg: "Error - msg not sent!", err: err.message } }))
				}
			})

			ws.on("close", () => {
				console.log("Connection closed - Client " + ws.id)
				delete wsClientList[ws.id]
			})
		} catch (err: any) {
			console.error(err)
			ws.send(JSON.stringify({ type: "error", payload: { msg: "Error - something went wrong!", err: err.message } }))
			ws.close()
		}
	})
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

export const broadcast = (clients: Types.Array<Types.ObjectId>, sender: any, msg: string, msgType: string) => {
	const msgData: IMessageData = { type: msgType, payload: { id: "", msgDate: new Date(), username: sender.username, msg: msg } }
	clients.forEach((client) => {
		const c = client.toString()
		if (wsClientList[c] && c !== sender.id && wsClientList[c].readyState === 1) wsClientList[c].send(JSON.stringify(msgData))
	})
}
