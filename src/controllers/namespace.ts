import express from "express"
import * as Namespace from "../models/namespace"

export const getAllNamespaces = async (req: express.Request, res: express.Response) => {
	try {
		const namespaces = await Namespace.getAll()

		return res.status(200).json(namespaces)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const getNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const namespace = await Namespace.getByNamespace(req.params.namespace)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const createNewNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const namespace = await Namespace.create(req.body)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const updateNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const updatedNamespace = await Namespace.update(req.params.namespace, req.body)

		return res.status(200).json(updatedNamespace)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const deleteNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const namespace = await Namespace.remove(req.params.namespace)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const addClientToNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const namespace = await Namespace.addClient(req.params.namespace, req.params.clientId)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const removeClientFromNamespace = async (req: express.Request, res: express.Response) => {
	try {
		const namespace = await Namespace.removeClient(req.params.namespace, req.params.clientId)

		return res.status(200).json(namespace)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}
