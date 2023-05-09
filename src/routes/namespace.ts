import express from "express"
import {
	getAllNamespaces,
	getNamespace,
	createNewNamespace,
	updateNamespace,
	deleteNamespace,
	addClientToNamespace,
	removeClientFromNamespace,
} from "../controllers/namespace"

export default (router: express.Router) => {
	router.get("/namespaces", getAllNamespaces)
	router.get("/namespaces/:namespace", getNamespace)
	router.post("/namespaces", createNewNamespace)
	router.put("/namespaces/:namespace", updateNamespace)
	router.delete("/namespaces/:namespace", deleteNamespace)
	router.post("/namespaces/:namespace/client/:clientId", addClientToNamespace)
	router.delete("/namespaces/:namespace/client/:clientId", removeClientFromNamespace)
}
