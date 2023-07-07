import { Request, Response, NextFunction } from "express"
import { isAuth } from "../services/auth"

export const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
	try {
		const sessionToken = req.cookies["WS-MANAGER-AUTH"]

		if (!sessionToken) return res.sendStatus(403)

		const user = await isAuth(sessionToken)
		req.user = user.toObject()
		return next()
	} catch (error) {
		return res.status(400).json(error)
	}
}

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
	try {
		if (req.user.role !== "admin") return res.sendStatus(403)
		return next()
	} catch (error) {
		return res.status(400).json(error)
	}
}
