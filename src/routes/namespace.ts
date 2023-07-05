import express from "express"
import {
	getAllNamespaces,
	getNamespace,
	createNewNamespace,
	updateNamespace,
	deleteNamespace,
	addClientToNamespace,
	removeClientFromNamespace,
	broadcast,
} from "../controllers/namespaces"
import { isAuthenticated } from "../middleware"

export default (router: express.Router) => {
	router.get("/namespaces", isAuthenticated, getAllNamespaces)
	router.get("/namespaces/:namespace", isAuthenticated, getNamespace)
	router.post("/namespaces", isAuthenticated, createNewNamespace)
	router.put("/namespaces/:namespace", isAuthenticated, updateNamespace)
	router.delete("/namespaces/:namespace", isAuthenticated, deleteNamespace)
	router.post("/namespaces/:namespace/clients/:clientId", isAuthenticated, addClientToNamespace)
	router.delete("/namespaces/:namespace/clients/:clientId", isAuthenticated, removeClientFromNamespace)
	router.post("/namespaces/:namespace/broadcast", isAuthenticated, broadcast)
}
