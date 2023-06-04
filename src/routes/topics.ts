import express from "express"
import {
	getTopicByName,
	createTopic,
	updateTopicName,
	deleteTopic,
	addClientToTopic,
	removeClientFromTopic,
	updateSchema,
	broadcast,
} from "../controllers/topics"
import { isAuthenticated } from "../middleware"

export default (router: express.Router) => {
	router.get("/namespaces/:namespace/topics/:topicName", getTopicByName)
	router.post("/namespaces/:namespace/topics", createTopic)
	router.put("/namespaces/:namespace/topics/:topicName/name", updateTopicName)
	router.delete("/namespaces/:namespace/topics/:topicName", deleteTopic)
	router.post("/namespaces/:namespace/topics/:topicName/clients/:clientId", addClientToTopic)
	router.delete("/namespaces/:namespace/topics/:topicName/clients/:clientId", removeClientFromTopic)
	router.patch("/namespaces/:namespace/topics/:topicName/schema", updateSchema)
	router.post("/namespaces/:namespace/topics/:topicName/broadcast", isAuthenticated, broadcast)
}
