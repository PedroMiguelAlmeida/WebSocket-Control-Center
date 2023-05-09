import mongoose from "mongoose"
import { Namespace, INamespace, IRoom, getByNamespace } from "./namespace"

export const getByName = async (namespace: string, roomName: string) =>
	await Namespace.findOne({ namespace: namespace, rooms: { $elemMatch: { roomName: roomName } } })

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

export const update = async (namespace: string, roomName: string, roomData: IRoom) => {
	const ns: any = await getByNamespace(namespace)
	const room = ns.rooms.roomName(roomName)
	room.set(roomData)
	await ns.save()
	return ns
}

export const remove = async (namespace: string, roomName: string) => {
	const ns: any = await getByNamespace(namespace)
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
	const ns: any = await getByNamespace(namespace)
	const room = ns.rooms.roomName(roomName)
	if (!room) {
		throw new Error("Room not found")
	}
	room.clients.push(clientId)
	ns.save()
}

export const removeClient = async (namespace: string, roomName: string, clientId: String) => {
	const ns: any = await getByNamespace(namespace)
	const room = ns.rooms.roomName(roomName)
	if (!room) {
		throw new Error("Room not found")
	}
	room.clients.remove(clientId)
	ns.save()
}

export const updateSchema = async (namespace: string, roomName: string, roomSchema: string) => {
	const ns: any = await getByNamespace(namespace)
	const room = ns.rooms.roomName(roomName)
	if (!room) {
		throw new Error("Room not found")
	}
	room.roomSchema = roomSchema
	ns.save()
	return ns
}
