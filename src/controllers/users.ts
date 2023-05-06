import { Request, Response, NextFunction } from "express"

import * as User from "../models/users"

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.getAll()

		return res.status(200).json(users)
	} catch (error) {
		return res.status(400).json(error)
	}
}
