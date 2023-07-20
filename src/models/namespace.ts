import mongoose, { Document, Model, Schema, Types } from "mongoose"
import { getNamespace } from "../controllers/namespaces"

export interface ITopic extends Document {
	topicName: string
	clients: Types.Array<Types.ObjectId>
	topicSchema?: string
}

export interface INamespace extends Document {
	namespace: string
	topics: ITopic[]
	clients: Types.Array<Types.ObjectId>
}

const TopicSchema: Schema<ITopic> = new Schema<ITopic>(
	{
		topicName: { type: String, required: true },
		clients: [{ type: Schema.Types.ObjectId, ref: "User" }],
		topicSchema: { type: String, required: false, default: null },
	},
	{ timestamps: true }
)

const NamespaceSchema: Schema<INamespace> = new Schema<INamespace>(
	{
		namespace: { type: String, required: true, unique: true },
		topics: [TopicSchema],
		clients: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
)

export const Namespace: Model<INamespace> = mongoose.model<INamespace>("Namespace", NamespaceSchema)

export const getByNamespace = async (namespace: string) =>
	await Namespace.findOne({ namespace: namespace }).populate({ path: "topics.clients", model: "User" }).populate({ path: "clients", model: "User" })

export const getNamespaceClients = async (namespace: string) => await Namespace.findOne({ namespace: namespace }, "clients").exec()

export const getAll = async () =>
	await Namespace.aggregate([
		{
			$project: {
				_id: 1,
				namespace: 1,
				clientsCount: { $size: "$clients" },
				topicsCount: { $size: "$topics" },
			},
		},
	])

export const exists = async (namespace: string) => await Namespace.findOne({ namespace: namespace }).select({ _id: 1 }).lean()

export const create = async (namespace: INamespace) => {
	let ns: any = await new Namespace(namespace).save()
	ns["clientsCount"] = ns.clients.length || 0
	ns["topicsCount"] = ns.topics.length || 0
	return ns
}

export const update = async (namespaceName: string, namespace: INamespace) =>
	await Namespace.findOneAndUpdate({ namespace: namespaceName }, namespace, { new: true })

export const remove = async (namespace: String) => await Namespace.deleteOne({ namespace: namespace })

export const addClient = async (namespace: string, clientId: String) => {
	const ns = await Namespace.findOne({ namespace: namespace })
	if (!ns) throw new Error("Namespace not found")

	ns.clients.addToSet(clientId)
	await ns.save()
	return ns
}

export const removeClient = async (namespace: string, clientId: String) => {
	const ns = await Namespace.findOne({ namespace: namespace })
	if (!ns) throw new Error("Namespace not found")
	ns.clients.pull(clientId)
	await ns.save()
	return ns
}
