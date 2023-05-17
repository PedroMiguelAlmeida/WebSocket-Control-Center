import * as Room from "../models/rooms"
import * as Namespace from "../models/namespace"
import * as User from "../models/users"

export const getRoomByName = async (namespace: string, roomName: string) => {
	try {
		const room = await Room.getByName(namespace, roomName)

		return room
	} catch (err) {
		throw new Error("Failed to retrieve the room")
	}
}

export const createRoom = async (namespace: string, roomData: Namespace.IRoom) => {
	try {
		const newRoom = await Room.create(namespace, roomData)

		return newRoom
	} catch (err) {
		throw new Error("Failed to create a new room")
	}
}

export const updateRoomName = async (namespace: string, roomName: string, updatedName: string) => {
	try {
		const updatedRoom = await Room.updateName(namespace, roomName, updatedName)

		return updatedRoom
	} catch (err) {
		throw new Error("Failed to update the room name")
	}
}

export const deleteRoom = async (namespace: string, roomName: string) => {
	try {
		const deletedRoom = await Room.remove(namespace, roomName)

		return deletedRoom
	} catch (err) {
		throw new Error("Failed to delete the room")
	}
}

export const addClientToRoom = async (namespace: string, roomName: string, clientId: string) => {
	try {
		const clientExists = await User.exists(clientId)
		if (!clientExists) {
			throw new Error("User doesn't exist")
		}

		const updatedRoom = await Room.addClient(namespace, roomName, clientId)

		return updatedRoom
	} catch (err) {
		throw new Error("Failed to add client to the room")
	}
}

export const removeClientFromRoom = async (namespace: string, roomName: string, clientId: string) => {
	try {
		const clientExists = await User.exists(clientId)
		if (!clientExists) {
			throw new Error("User doesn't exist")
		}

		const updatedRoom = await Room.removeClient(namespace, roomName, clientId)

		return updatedRoom
	} catch (err) {
		throw new Error("Failed to remove client from the room")
	}
}

export const updateRoomSchema = async (namespace: string, roomName: string, schema: string) => {
	try {
		const updatedRoom = await Room.updateSchema(namespace, roomName, schema)

		return updatedRoom
	} catch (err) {
		throw new Error("Failed to update the room schema")
	}
}
