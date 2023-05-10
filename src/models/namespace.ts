import mongoose, { Document, Model, Schema, Types } from "mongoose"

export interface IRoom {
	[x: string]: any
	roomName: string
	clients: Types.Array<mongoose.Types.ObjectId>
	roomSchema?: string
}

export interface INamespace {
	namespace: string
	rooms: Types.Array<IRoom>
	clients: Types.Array<mongoose.Types.ObjectId>
}

export interface INamespaceDocument extends INamespace, Document {
	createdAt: Date
	updatedAt: Date
}

const RoomSchema = new mongoose.Schema(
	{
		roomName: { type: String, required: true },
		clients: [{ type: Schema.Types.ObjectId, ref: "User" }],
		roomSchema: { type: String, required: false, default: null },
	},
	{ timestamps: true }
)

const NamespaceSchema = new mongoose.Schema(
	{
		namespace: { type: String, required: true, unique: true },
		rooms: [RoomSchema],
		clients: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
)

export const Namespace = mongoose.model<INamespaceDocument>("Namespace", NamespaceSchema)

export const getByNamespace = async (namespace: string) => await Namespace.findOne({ namespace: namespace })

export const getAll = async () =>
	await Namespace.aggregate([
		{
			$project: {
				_id: 1,
				namespace: 1,
				clientsCount: { $size: "$clients" },
				roomsCount: { $size: "$rooms" },
			},
		},
	])

export const exists = async (namespace: string) => await Namespace.findOne({ namespace: namespace }).select({ _id: 1 }).lean()

export const create = async (namespace: INamespaceDocument) => await new Namespace(namespace).save().then((namespace) => namespace.toObject())

export const update = async (namespaceName: string, namespace: INamespaceDocument) =>
	await Namespace.findOneAndUpdate({ namespace: namespaceName }, namespace, { new: true })

export const remove = async (namespace: String) => await Namespace.deleteOne({ namespace: namespace })

export const addClient = async (namespace: string, clientId: String) => {
	const ns = await getByNamespace(namespace)
	if (!ns) throw new Error("Namespace not found")
	ns.clients.push(clientId)
	ns.save()
}

export async function removeClient(namespace: string, clientId: String): Promise<void> {
	const ns = (await getByNamespace(namespace)) as INamespaceDocument
	if (!ns) {
		throw new Error("Namespace not found")
	}
	ns.clients.pull(clientId)
	await ns.save()
}
