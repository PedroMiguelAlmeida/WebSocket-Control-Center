import { IncomingMessage } from "http"
import { Duplex } from "stream"
import { WebSocketServer } from "ws"
import * as Topic from "../services/topics"
import * as Namespace from "../services/namespaces"
import express from "express"
import { INamespace, ITopic } from "../models/namespace"
import { Types } from "mongoose"

interface clientData {
	type: string
	topicName: string
	payload: {
		msg: string
	}
}

export var wsClientList: { [id: string]: any } = {}

export const wss = new WebSocketServer({ clientTracking: false, noServer: true })
console.log("WS Server start")

wss.on("connection", function connection(ws: any) {
	ws.on("open", () => {
		console.log("Connection opened")
	})

	ws.on("message", async (dataString: string) => {
		try {
			let data = JSON.parse(dataString)

			if (!data.userId) throw new Error("userId required")
			if (!data.namespace) throw new Error("namespace required")

			ws.userId = data.userId
			wsClientList[data.userId] = ws
			console.log(wsClientList)
			switch (data.type) {
				case "message":
					let clients
					if (data.topicName && data.namespace) {
						const topic = await Topic.getTopicByName(data.namespace, data.topicName)
						if (!topic) throw new Error("Topic not found")
						clients = topic.clients
					} else {
						clients = await Namespace.getNamespaceClients(data.namespace)
					}
					clients.forEach((client) => {
						const c = client.toString()
						if (wsClientList[c] && c !== data.userId && wsClientList[c].readyState === 1)
							wsClientList[c].send(JSON.stringify({ type: "message", payload: { msg: data.payload.msg } }))
					})
					ws.send(JSON.stringify({ type: "message", payload: { msg: "Msg sent!" } }))
					break
				case "sub-topic":
					if (!data.topicName) throw new Error("topicName required")
					Topic.addClientToTopic(data.namespace, data.topicName, data.userId).then((topic: ITopic) => {
						ws.send(JSON.stringify({ type: "message", payload: { msg: "You subed to topic - " + data.topicName } }))
						broadcast(topic.clients, data.userId, "Client " + data.userId + " subed to topic - " + data.topicName)
					})
					break
				case "unsub-topic":
					if (!data.topicName) throw new Error("topicName required")
					Topic.removeClientFromTopic(data.namespace, data.topicName, data.userId).then((topic: ITopic) => {
						ws.send(JSON.stringify({ type: "message", payload: { msg: "You unsubed from topic - " + data.topicName } }))
						broadcast(topic.clients, data.userId, "Client " + data.userId + " unsubed from topic - " + data.topicName)
					})
					break
				case "sub-namespace":
					Namespace.addClientToNamespace(data.namespace, data.userId).then((namespace: INamespace) => {
						ws.send(JSON.stringify({ type: "message", payload: { msg: "You subed to namespace - " + data.namespace } }))
						broadcast(namespace.clients, data.userId, "Client " + data.userId + " subed to namespace - " + data.namespace)
					})
					break
				case "unsub-namespace":
					Namespace.removeClientFromNamespace(data.namespace, data.userId).then((namespace: INamespace) => {
						ws.send(JSON.stringify({ type: "message", payload: { msg: "You unsubed from namespace - " + data.namespace } }))
						broadcast(namespace.clients, data.userId, "Client " + data.userId + " unsubed from namespace - " + data.namespace)
					})
					break

				default:
					throw new Error("No type in data")
			}
		} catch (err) {
			console.error(err)
			ws.send(JSON.stringify({ type: "error", payload: { msg: "Error - msg not sent to topic!", err: err } }))
		}
	})

	ws.on("close", () => {
		console.log("Connection closed - Client " + ws.id)

		// topics2.removeClientFromAllTopics(ws)

		// console.log(topics2.getTopic("topic1").clients.length + " clients in topic 1")
		// console.log(`Client ${ws.id} removed from all topics`)
	})
})

const onSocketError = (err: any) => {
	console.error(err)
}

export const broadcast = (clients: Types.Array<Types.ObjectId>, sender: string, msg: string) => {
	clients.forEach((client) => {
		const c = client.toString()
		if (wsClientList[c] && c !== sender && wsClientList[c].readyState === 1)
			wsClientList[c].send(JSON.stringify({ type: "message", payload: { msg: msg } }))
	})
}
