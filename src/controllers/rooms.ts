import { Request, Response, NextFunction } from "express"
import * as Room from "../models/rooms"
import * as User from "../models/users"

export const getRoomByName = async (req: Request, res: Response) => {
	try {
		const room = await Room.getByName(req.params.namespace, req.params.roomName)

		if (!room) return res.status(404).json({ message: "room doesn't exist" })

		return res.status(200).json(room)
	} catch (err: any) {
		return res.status(404).json({ message: err.message })
	}
}

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const namespace = req.params.namespace

		const newRoom = await Room.create(namespace, req.body)

		return res.status(201).json(newRoom).end()
	} catch (err: any) {
		return res.status(404).json({ message: err.message })
	}
}

export const updateRoomName = async (req: Request, res: Response) => {
	try {
		const updatedRoom = await Room.updateName(req.params.namespace, req.params.roomName, req.body)

		return res.status(200).json(updatedRoom)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const deleteRoom = async (req: Request, res: Response) => {
	try {
		const deletedRoom = await Room.remove(req.params.namespace, req.params.roomName)

		return res.status(200).json(deletedRoom)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const addClientToRoom = async (req: Request, res: Response) => {
	try {
		const { email } = req.body

		if (!email) return res.status(400).json({ message: "email is required" })

		const client = await User.getByEmail(email)
		if (!client) return res.status(404).json({ message: "client doesn't exist" })

		const updatedRoom = await Room.addClient(req.params.namespace, req.params.roomName, client._id)

		return res.status(200).json(updatedRoom)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const removeClientToRoom = async (req: Request, res: Response) => {
	try {
		const clientId = req.params.id

		const updatedRoom = await Room.removeClient(req.params.namespace, req.params.roomName, clientId)

		return res.status(200).json(updatedRoom)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}

export const updateSchema = async (req: Request, res: Response) => {
	try {
		const { schema } = req.body

		const updatedRoom = await Room.updateSchema(req.params.namespace, req.params.roomName, schema)

		return res.status(200).json(updatedRoom)
	} catch (err: any) {
		return res.status(400).json({ message: err.message })
	}
}
