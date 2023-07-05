import * as Topic from "../models/topic"
import * as Namespace from "../models/namespace"
import * as User from "../models/user"
import Ajv, { AnySchema, JSONSchemaType } from "ajv"

const ajv = new Ajv()
export const getTopicByName = async (namespace: string, topicName: string) => {
	try {
		const ns = await Topic.getByName(namespace, topicName)
		if (!ns) throw "Namespace doesnt exist!"
		if (!ns.topics[0]) throw "Topic doesnt exist in this Namespace!"
		return ns
	} catch (err) {
		throw "Failed to retrieve the topic"
	}
}

export const getTopicByNameUnpop = async (namespace: string, topicName: string) => {
	try {
		const ns = await Topic.getByNameUnpop(namespace, topicName)
		if (!ns) throw "Namespace doesnt exist!"
		if (!ns.topics[0]) throw "Topic doesnt exist in this Namespace!"
		return ns
	} catch (err) {
		throw "Failed to retrieve the topic"
	}
}

export const createTopic = async (namespace: string, topicData: Namespace.ITopic) => {
	try {
		const newTopic = await Topic.create(namespace, topicData)

		return newTopic
	} catch (err) {
		throw "Failed to create a new topic"
	}
}

export const updateTopicName = async (namespace: string, topicName: string, updatedName: string) => {
	try {
		const updatedTopic = await Topic.updateName(namespace, topicName, updatedName)

		return updatedTopic
	} catch (err) {
		throw "Failed to update the topic name"
	}
}

export const deleteTopic = async (namespace: string, topicName: string) => {
	try {
		const deletedTopic = await Topic.remove(namespace, topicName)

		return deletedTopic
	} catch (err) {
		throw "Failed to delete the topic"
	}
}

export const addClientToTopic = async (namespace: string, topicName: string, clientId: string) => {
	try {
		const clientExists = await User.exists(clientId)
		if (!clientExists) {
			throw "User doesn't exist"
		}

		const updatedTopic = await Topic.addClient(namespace, topicName, clientId)

		return updatedTopic
	} catch (err) {
		throw "Failed to add client to the topic"
	}
}

export const removeClientFromTopic = async (namespace: string, topicName: string, clientId: string) => {
	try {
		const clientExists = await User.exists(clientId)
		if (!clientExists) {
			throw "User doesn't exist"
		}

		const updatedTopic = await Topic.removeClient(namespace, topicName, clientId)

		return updatedTopic
	} catch (err) {
		throw "Failed to remove client from the topic"
	}
}

export const updateTopicSchema = async (namespace: string, topicName: string, schema: AnySchema) => {
	try {
		const valid = ajv.compile(schema)
		if (!valid) throw "Invalid schema"

		const updatedTopic = await Topic.updateSchema(namespace, topicName, JSON.stringify(schema))
		return updatedTopic
	} catch (err) {
		throw err
	}
}

export const validateSchemaData = (schema: AnySchema, data: string) => {
	try {
		if (typeof data === "string") data = JSON.parse(data)
		const validate = ajv.compile(schema)
		const valid = validate(data)
		return valid
	} catch (err) {
		throw err
	}
}
