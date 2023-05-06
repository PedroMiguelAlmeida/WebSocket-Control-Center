import { Request, Response, NextFunction } from "express"

import { getBySessionToken } from "../models/users"

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sessionToken = req.cookies["WS-MANAGER-AUTH"]

		if (!sessionToken) return res.sendStatus(403)

		const user = await getBySessionToken(sessionToken)

		if (!user) return res.sendStatus(403)

		return res.status(200).json(user).end()
	} catch (error) {
		return res.status(400).json(error).end()
	}
}
