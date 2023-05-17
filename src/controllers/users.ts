import { Request, Response, NextFunction } from "express"

import * as User from "../services/users"

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.getAllUsers()

		return res.status(200).json(users)
	} catch (error) {
		return res.status(400).json(error)
	}
}
