import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { isAuth } from "../services/auth"

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sessionToken = req.cookies["WS-MANAGER-AUTH"]

		if (!sessionToken) return res.sendStatus(403)

		const user = isAuth(sessionToken)

		return res.status(200).end()
	} catch (error) {
		return res.status(400).json(error).end()
	}
}
