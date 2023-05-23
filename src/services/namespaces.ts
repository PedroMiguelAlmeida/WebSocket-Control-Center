import * as Namespace from "../models/namespace"
import * as User from "../models/users"

export const getAllNamespaces = async () => {
	try {
		const namespaces = await Namespace.getAll()
		return namespaces
	} catch (err) {
		throw new Error("Failed to retrieve namespaces")
	}
}

export const getNamespaceByNamespace = async (namespace: string) => {
	try {
		const namespaceData = await Namespace.getByNamespace(namespace)
		return namespaceData
	} catch (err) {
		throw new Error("Failed to retrieve the namespace")
	}
}

export const getNamespaceClients = async (namespace: string) => {
	try {
		const namespaceClients = await Namespace.getNamespaceClients(namespace)
		if (namespaceClients === null) throw new Error("Namespace not found")
		if (namespaceClients.clients.length === 0) throw new Error("No clients subed to this namespace")
		return namespaceClients.clients
	} catch (err) {
		throw new Error("Failed to retrieve the namespace clients")
	}
}

export const createNamespace = async (namespaceData: Namespace.INamespace) => {
	try {
		const newNamespace = await Namespace.create(namespaceData)
		return newNamespace
	} catch (err) {
		throw new Error("Failed to create a new namespace")
	}
}

export const updateNamespace = async (namespace: string, updatedData: Namespace.INamespace) => {
	try {
		const updatedNamespace = await Namespace.update(namespace, updatedData)
		return updatedNamespace
	} catch (err) {
		throw new Error("Failed to update the namespace")
	}
}

export const deleteNamespace = async (namespace: string) => {
	try {
		const deletedNamespace = await Namespace.remove(namespace)
		return deletedNamespace
	} catch (err) {
		throw new Error("Failed to delete the namespace")
	}
}

export const addClientToNamespace = async (namespace: string, clientId: string) => {
	try {
		const clientExists = await User.exists(clientId)
		if (!clientExists) throw new Error("User doesn't exist")

		const updatedNamespace = await Namespace.addClient(namespace, clientId)
		return updatedNamespace
	} catch (err) {
		throw new Error("Failed to add client to the namespace")
	}
}

export const removeClientFromNamespace = async (namespace: string, clientId: string) => {
	try {
		const clientExists = await User.exists(clientId)
		if (!clientExists) throw new Error("User doesn't exist")

		const updatedNamespace = await Namespace.removeClient(namespace, clientId)
		return updatedNamespace
	} catch (err) {
		throw new Error("Failed to remove client from the namespace")
	}
}
