import mongoose from "mongoose"
import { Namespace, INamespace, ITopic, getByNamespace /*INamespaceDocument*/ } from "./namespace"

export const getByName = async (namespace: string, topicName: string) =>
	await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName })
		.populate({ path: "clients", model: "User" })
		.populate({ path: "topics.clients", model: "User" })
		.exec()

export const getByNameUnpop = async (namespace: string, topicName: string) => await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName })

export const getClients = async (namespace: string, topicName: string) =>
	await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }, "topics.clients").exec()

export const exists = async (namespace: string, topicName: string) =>
	await Namespace.findOne({ namespace: namespace, topicName: topicName }).select({ _id: 1 }).lean()

export const create = async (namespace: string, topicData: ITopic): Promise<INamespace> => {
	const ns = await Namespace.findOne({ namespace: namespace }).exec()
	if (!ns) throw new Error("Namespace not found")
	const topicExists = ns.topics.some((topic) => topic.topicName === topicData.topicName)
	if (topicExists) throw new Error("Topic already exists")
	ns.topics.push(topicData)
	ns.save().catch((err) => {
		throw new Error(err)
	})
	return ns
}

export const updateName = async (namespace: string, topicName: string, newTopicName: string) => {
	const ns = await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }).exec()
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
	const ns = await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }).exec()
	if (!ns) throw new Error("Namespace not found")
	if (ns.topics.length === 0) throw new Error("Topic not found in namespace")
	ns.clients.addToSet(clientId)
	ns.topics[0].clients.addToSet(clientId)
	await ns.save()
	return ns.topics[0]
}

export const removeClient = async (namespace: string, topicName: string, clientId: String): Promise<ITopic> => {
	const ns = await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }).exec()
	if (!ns) throw new Error("Namespace not found")
	if (ns.topics.length === 0) throw new Error("Topic not found in namespace")

	ns.clients.pull(clientId)
	ns.topics[0].clients.pull(clientId)
	await ns.save()
	return ns.topics[0]
}

export const updateSchema = async (namespace: string, topicName: string, topicSchema: string) => {
	const ns = await Namespace.findOne({ namespace: namespace, "topics.topicName": topicName }).exec()
	if (!ns) throw new Error("Namespace not found")
	const topic = ns.topics.find((topic: { topicName: string }) => topic.topicName === topicName)
	if (!topic) throw new Error("Topic not found")

	topic.topicSchema = topicSchema
	await ns.save()
	return ns
}
