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

export default (router: express.Router) => {
	router.get("/namespaces", getAllNamespaces)
	router.get("/namespaces/:namespace", getNamespace)
	router.post("/namespaces", createNewNamespace)
	router.put("/namespaces/:namespace", updateNamespace)
	router.delete("/namespaces/:namespace", deleteNamespace)
	router.post("/namespaces/:namespace/clients/:clientId", addClientToNamespace)
	router.delete("/namespaces/:namespace/clients/:clientId", removeClientFromNamespace)
	router.post("/namespaces/:namespace/broadcast", broadcast)
}
