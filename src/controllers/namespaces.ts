import express from "express"
import * as Namespace from "../services/namespaces"
import * as User from "../models/users"
import { wsClientList } from "../services/websocket"

export const getAllNamespaces = async (req: express.Request, res: express.Response) => {
	try {
		const namespaces = await Namespace.getAllNamespaces()

		return res.status(200).json(namespaces)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const getNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const namespace = await Namespace.getNamespaceByNamespace(req.params.namespace)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const createNewNamespace = async (req: express.Request, res: express.Response) => {
	try {
		if (!req.body.namespace) return res.status(400).json({ message: "Missing namespace" })

		const namespace = await Namespace.createNamespace(req.body)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const updateNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const updatedNamespace = await Namespace.updateNamespace(req.params.namespace, req.body)

		return res.status(200).json(updatedNamespace)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const deleteNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const namespace = await Namespace.deleteNamespace(req.params.namespace)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const addClientToNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const client = await User.exists(req.params.clientId)
		if (!client) return res.status(404).json({ message: "User doesn't exist" })

		const namespace = await Namespace.addClientToNamespace(req.params.namespace, req.params.clientId)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const removeClientFromNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const client = await User.exists(req.params.clientId)
		if (!client) return res.status(404).json({ message: "User doesn't exist" })

		const namespace = await Namespace.removeClientFromNamespace(req.params.namespace, req.params.clientId)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const broadcast = async (req: express.Request, res: express.Response) => {
	try {
		const msg = req.body.message
		if (!msg) return res.status(400).json({ message: "Missing message" })

		const clientList = await Namespace.getNamespaceClients(req.params.namespace)
		if (!clientList) return res.status(404).json({ message: "No clients in namespace" })

		clientList.forEach((client: any) => {
			wsClientList[client].send(msg)
		})

		return res.status(200).json(clientList)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}
