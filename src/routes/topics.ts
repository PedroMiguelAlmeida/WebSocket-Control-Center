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
	router.get("/namespaces/:namespace/topics/:topicName", isAuthenticated, getTopicByName)
	router.post("/namespaces/:namespace/topics", isAuthenticated, createTopic)
	router.patch("/namespaces/:namespace/topics/:topicName/name", isAuthenticated, updateTopicName)
	router.delete("/namespaces/:namespace/topics/:topicName", isAuthenticated, deleteTopic)
	router.post("/namespaces/:namespace/topics/:topicName/clients/:clientId", isAuthenticated, addClientToTopic)
	router.delete("/namespaces/:namespace/topics/:topicName/clients/:clientId", isAuthenticated, removeClientFromTopic)
	router.patch("/namespaces/:namespace/topics/:topicName/schema", isAuthenticated, updateSchema)
	router.post("/namespaces/:namespace/topics/:topicName/broadcast", isAuthenticated, isAuthenticated, broadcast)
}
