import mongoose from "mongoose"
import { Namespace, INamespace, IRoom, getByNamespace } from "./namespace"

export const getByName = async (namespace: string, roomName: string) => await Namespace.findOne({ namespace: namespace, "rooms.roomName": roomName })

export const exists = async (namespace: string, roomName: string) =>
	await Namespace.findOne({ namespace: namespace, roomName: roomName }).select({ _id: 1 }).lean()

export const create = async (namespace: string, roomData: IRoom) =>
	Namespace.findOneAndUpdate({ namespace: namespace }, { $push: { rooms: roomData } }, { new: true })

export const updateName = async (namespace: string, roomName: string, newRoomName: string) =>
	Namespace.updateOne({ namespace: namespace, "rooms.roomName": roomName }, { $set: { "rooms.$.roomName": newRoomName } })

export const remove = async (namespace: string, roomName: string) => Namespace.updateOne({ namespace: namespace }, { $pull: { rooms: { roomName: roomName } } })

export const addClient = async (namespace: string, roomName: string, clientId: String) =>
	Namespace.updateOne({ namespace: namespace, "rooms.roomName": roomName }, { $push: { "rooms.$.clients": clientId } })

export const removeClient = async (namespace: string, roomName: string, clientId: String) =>
	Namespace.updateOne({ namespace: namespace, "rooms.roomName": roomName }, { $pull: { "rooms.$.clients": clientId } })

export const updateSchema = async (namespace: string, roomName: string, roomSchema: string) => {
	Namespace.updateOne({ namespace: namespace, "rooms.roomName": roomName }, { $set: { "rooms.$.roomSchema": roomSchema } })
}
