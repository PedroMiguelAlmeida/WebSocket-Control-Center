import { Request, Response, NextFunction } from "express"
import * as roomService from "../services/rooms"
import * as User from "../models/users"

export const getRoomByName = async (req: Request, res: Response) => {
	try {
		const room = await roomService.getRoomByName(req.params.namespace, req.params.roomName)

		if (!room) {
			return res.status(400).json({ message: "Room doesn't exist" })
		}

		return res.status(200).json(room)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const namespace = req.params.namespace
		const newRoom = await roomService.createRoom(namespace, req.body)

		return res.status(201).json(newRoom).end()
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const updateRoomName = async (req: Request, res: Response) => {
	try {
		const updatedRoom = await roomService.updateRoomName(req.params.namespace, req.params.roomName, req.body)

		return res.status(200).json(updatedRoom)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const deleteRoom = async (req: Request, res: Response) => {
	try {
		const deletedRoom = await roomService.deleteRoom(req.params.namespace, req.params.roomName)

		return res.status(200).json(deletedRoom)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const addClientToRoom = async (req: Request, res: Response) => {
	try {
		const client = await User.exists(req.params.clientId)
		if (!client) {
			return res.status(400).json({ message: "User doesn't exist" })
		}

		const updatedRoom = await roomService.addClientToRoom(req.params.namespace, req.params.roomName, req.params.clientId)

		return res.status(200).json(updatedRoom)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const removeClientFromRoom = async (req: Request, res: Response) => {
	try {
		const client = await User.exists(req.params.clientId)
		if (!client) {
			return res.status(400).json({ message: "User doesn't exist" })
		}

		const updatedRoom = await roomService.removeClientFromRoom(req.params.namespace, req.params.roomName, req.params.clientId)

		return res.status(200).json(updatedRoom)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const updateSchema = async (req: Request, res: Response) => {
	try {
		const { schema } = req.body

		const updatedRoom = await roomService.updateRoomSchema(req.params.namespace, req.params.roomName, schema)

		return res.status(200).json(updatedRoom)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}
