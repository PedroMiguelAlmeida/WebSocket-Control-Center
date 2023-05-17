import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sessionToken = req.cookies["WS-MANAGER-AUTH"]

		if (!sessionToken) return res.sendStatus(403)

		const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET as string)

		return res.status(200).end()
	} catch (error) {
		return res.status(400).json(error).end()
	}
}
