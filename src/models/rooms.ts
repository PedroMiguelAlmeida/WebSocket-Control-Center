import { Namespace, INamespace, IRoom, getByNamespace, INamespaceDocument } from "./namespace"

export const getByName = async (namespace: string, roomName: string) => {
	const ns = await getByNamespace(namespace)
	if (!ns) throw new Error("Namespace not found")
	const room = ns.rooms.find((room: { roomName: string }) => room.roomName === roomName)
	if (!room) throw new Error("Room not found")
	return { namespace: ns.namespace, clients: ns.clients, room }
}

export const exists = async (namespace: string, roomName: string) =>
	await Namespace.findOne({ namespace: namespace, roomName: roomName }).select({ _id: 1 }).lean()

export const create = async (namespace: string, roomData: IRoom): Promise<INamespace> => {
	const ns = await getByNamespace(namespace)
	if (!ns) throw new Error("Namespace not found")
	const roomExists = ns.rooms.some((room) => room.roomName === roomData.roomName)
	if (roomExists) throw new Error("Room already exists")
	ns.rooms.push(roomData)
	ns.save()
	return ns
}

export const updateName = async (namespace: string, roomName: string, newRoomName: string) => {
	const ns = await getByNamespace(namespace)
	if (!ns) throw new Error("Namespace not found")
	const room = ns.rooms.find((room: { roomName: string }) => room.roomName === roomName)
	if (!room) throw new Error("Room not found")

	room.roomName = newRoomName
	await ns.save()
	return ns
}

export const remove = async (namespace: string, roomName: string) => {
	const ns = await getByNamespace(namespace)
	if (!ns) throw new Error("Namespace not found")
	const roomIndex = ns.rooms.findIndex((room: { roomName: string }) => room.roomName === roomName)
	if (roomIndex >= 0) {
		ns.rooms.splice(roomIndex, 1)
		await ns.save()
		return ns
	} else {
		throw new Error("Room not found in namespace")
	}
}


export const addClient = async (namespace: string, roomName: string, clientId: String) => {
	const ns = await getByNamespace(namespace)
	if (!ns) throw new Error("Namespace not found")
	const room = ns.rooms.find((room: { roomName: string }) => room.roomName === roomName)
	if (!room) throw new Error("Room not found")

	room.clients.push(clientId)
	ns.save()
}

export const removeClient = async (namespace: string, roomName: string, clientId: String) => {
	const ns = await getByNamespace(namespace)
	if (!ns) throw new Error("Namespace not found")
	const room = ns.rooms.find((room: { roomName: string }) => room.roomName === roomName)
	if (!room) throw new Error("Room not found")

	room.clients.pull(clientId)
	ns.save()
}

export const updateSchema = async (namespace: string, roomName: string, roomSchema: string) => {
	const ns = await getByNamespace(namespace)
	if (!ns) throw new Error("Namespace not found")
	const room = ns.rooms.find((room: { roomName: string }) => room.roomName === roomName)
	if (!room) throw new Error("Room not found")

	room.roomSchema = roomSchema
	ns.save()
	return ns
}
