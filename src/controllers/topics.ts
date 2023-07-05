import { Request, Response, NextFunction } from "express"
import * as topicService from "../services/topics"
import * as User from "../models/user"
import * as Topic from "../models/topic"
import { wsClientList, IMessageData } from "../services/websocket"

export const getTopicByName = async (req: Request, res: Response) => {
	try {
		const topic = await topicService.getTopicByName(req.params.namespace, req.params.topicName)

		if (!topic) {
			return res.status(400).json({ message: "Topic doesn't exist" })
		}

		return res.status(200).json(topic)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const createTopic = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const namespace = req.params.namespace
		const newTopic = await topicService.createTopic(namespace, req.body)

		return res.status(201).json(newTopic).end()
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const updateTopicName = async (req: Request, res: Response) => {
	try {
		const updatedTopic = await topicService.updateTopicName(req.params.namespace, req.params.topicName, req.body)

		return res.status(200).json(updatedTopic)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const deleteTopic = async (req: Request, res: Response) => {
	try {
		const deletedTopic = await topicService.deleteTopic(req.params.namespace, req.params.topicName)

		return res.status(200).json(deletedTopic)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const addClientToTopic = async (req: Request, res: Response) => {
	try {
		const client = await User.exists(req.params.clientId)
		if (!client) {
			return res.status(400).json({ message: "User doesn't exist" })
		}

		const updatedTopic = await topicService.addClientToTopic(req.params.namespace, req.params.topicName, req.params.clientId)

		return res.status(200).json(updatedTopic)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const removeClientFromTopic = async (req: Request, res: Response) => {
	try {
		const client = await User.exists(req.params.clientId)
		if (!client) {
			return res.status(400).json({ message: "User doesn't exist" })
		}

		const updatedTopic = await topicService.removeClientFromTopic(req.params.namespace, req.params.topicName, req.params.clientId)

		return res.status(200).json(updatedTopic)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const updateSchema = async (req: Request, res: Response) => {
	try {
		const { schema } = req.body

		const updatedTopic = await topicService.updateTopicSchema(req.params.namespace, req.params.topicName, schema)

		return res.status(200).json(updatedTopic)
	} catch (err: any) {
		return res.status(500).json({ message: err.message, err: err })
	}
}

export const broadcast = async (req: Request, res: Response) => {
	try {
		const msg = req.body.message
		if (!msg) return res.status(400).json({ message: "Missing message" })

		const user = req.user

		const namespace = await topicService.getTopicByNameUnpop(req.params.namespace, req.params.topicName)
		const topic = namespace.topics[0]

		if (topic.topicSchema) {
			const valid = topicService.validateSchemaData(JSON.parse(topic.topicSchema), msg)
			if (!valid) throw new Error("Data does not match the topic schema!")
		}

		const msgData: IMessageData = { type: "message", payload: { id: "", msgDate: new Date(), username: user!.username, msg: msg } }
		const clientList = topic.clients
		clientList.forEach((client: any) => {
			if (wsClientList[client]) wsClientList[client].send(JSON.stringify(msgData))
		})

		return res.status(200).json(clientList)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}
