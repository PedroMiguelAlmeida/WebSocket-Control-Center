import mongoose from "mongoose"
import { Namespace, INamespace, ITopic, getByNamespace /*INamespaceDocument*/ } from "./namespace"

export const getByName = async (namespace: string, topicName: string) =>
	await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }, { "topics.$": 1, namespace: 1 })
		.populate({ path: "clients", model: "User" })
		.populate({ path: "topics.clients", model: "User" })
		.exec()

export const getByNameUnpop = async (namespace: string, topicName: string) =>
	await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }, { "topics.$": 1, namespace: 1 }).exec()

export const getClients = async (namespace: string, topicName: string) =>
	await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }, "topics.clients").exec()

export const exists = async (namespace: string, topicName: string) =>
	await Namespace.findOne({ namespace: namespace, topicName: topicName }).select({ _id: 1 }).lean()

export const create = async (namespace: string, topicData: ITopic): Promise<any> => {
	const ns = await Namespace.findOne({ namespace: namespace, "topics.topicName": topicData.topicName })
		.then((existingNamespace: any) => {
			if (existingNamespace) {
				// If the topic already exists, return an error
				throw new Error("Topic already exists in the namespace.")
			} else {
				// If the topic doesn't exist, add it to the topics array
				return Namespace.findOneAndUpdate({ namespace: namespace }, { $addToSet: { topics: topicData } }, { new: true })
					.populate({ path: "clients", model: "User" })
					.populate({ path: "topics.clients", model: "User" })
					.exec()
			}
		})
		.catch((error: any) => {
			// Handle the error here
			throw new Error(error.message)
		})
	return ns
}

export const updateName = async (namespace: string, topicName: string, newTopicName: string) => {
	const ns = await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }, { "topics.$": 1, namespace: 1 }).exec()
	if (!ns) throw new Error("Namespace not found")
	if (ns.topics.length === 0) throw new Error("Topic not found in namespace")
	ns.topics[0].topicName = newTopicName
	await ns.save()
	return ns
}

export const remove = async (namespace: string, topicName: string) => {
	const ns = await Namespace.findOne({ namespace: namespace }).exec()
	if (!ns) throw new Error("Namespace not found")
	const topicIndex = ns.topics.findIndex((topic: { topicName: string }) => topic.topicName === topicName)
	if (topicIndex === -1) throw new Error("Topic not found in namespace")
	ns.topics.splice(topicIndex, 1)
	await ns.save()
	return ns
}

export const addClient = async (namespace: string, topicName: string, clientId: String): Promise<ITopic> => {
	const ns = await Namespace.findOneAndUpdate(
		{ namespace: namespace, "topics.topicName": topicName },
		{
			$addToSet: {
				clients: clientId,
				"topics.$.clients": clientId,
			},
		},
		{ new: true }
	).exec()
	if (!ns) throw new Error("Namespace not found")
	if (ns.topics.length === 0) throw new Error("Topic not found in namespace")
	return ns.topics[0]
}

export const removeClient = async (namespace: string, topicName: string, clientId: String): Promise<ITopic> => {
	const ns = await Namespace.findOneAndUpdate(
		{ namespace: namespace, "topics.topicName": topicName },
		{
			$pull: {
				clients: clientId,
				"topics.$.clients": clientId,
			},
		},
		{ new: true }
	).exec()
	if (!ns) throw new Error("Namespace not found")
	return ns.topics[0]
}

export const updateSchema = async (namespace: string, topicName: string, topicSchema: string) => {
	const ns = Namespace.findOneAndUpdate({ namespace: namespace, "topics.topicName": topicName }, { $set: { schema: topicSchema } }, { new: true })
		.select({ topics: { $elemMatch: { topicName: topicName } } })
		.exec()
	return ns
}
