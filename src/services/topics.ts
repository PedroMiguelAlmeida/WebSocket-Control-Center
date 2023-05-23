import * as Topic from "../models/topic"
import * as Namespace from "../models/namespace"
import * as User from "../models/users"

export const getTopicByName = async (namespace: string, topicName: string) => {
	try {
		const topic = await Topic.getByName(namespace, topicName)

		return topic
	} catch (err) {
		throw new Error("Failed to retrieve the topic")
	}
}

export const createTopic = async (namespace: string, topicData: Namespace.ITopic) => {
	try {
		const newTopic = await Topic.create(namespace, topicData)

		return newTopic
	} catch (err) {
		throw new Error("Failed to create a new topic")
	}
}

export const updateTopicName = async (namespace: string, topicName: string, updatedName: string) => {
	try {
		const updatedTopic = await Topic.updateName(namespace, topicName, updatedName)

		return updatedTopic
	} catch (err) {
		throw new Error("Failed to update the topic name")
	}
}

export const deleteTopic = async (namespace: string, topicName: string) => {
	try {
		const deletedTopic = await Topic.remove(namespace, topicName)

		return deletedTopic
	} catch (err) {
		throw new Error("Failed to delete the topic")
	}
}

export const addClientToTopic = async (namespace: string, topicName: string, clientId: string) => {
	try {
		const clientExists = await User.exists(clientId)
		if (!clientExists) {
			throw new Error("User doesn't exist")
		}

		const updatedTopic = await Topic.addClient(namespace, topicName, clientId)

		return updatedTopic
	} catch (err) {
		throw new Error("Failed to add client to the topic")
	}
}

export const removeClientFromTopic = async (namespace: string, topicName: string, clientId: string) => {
	try {
		const clientExists = await User.exists(clientId)
		if (!clientExists) {
			throw new Error("User doesn't exist")
		}

		const updatedTopic = await Topic.removeClient(namespace, topicName, clientId)

		return updatedTopic
	} catch (err) {
		throw new Error("Failed to remove client from the topic")
	}
}

export const updateTopicSchema = async (namespace: string, topicName: string, schema: string) => {
	try {
		const updatedTopic = await Topic.updateSchema(namespace, topicName, schema)

		return updatedTopic
	} catch (err) {
		throw new Error("Failed to update the topic schema")
	}
}
