import { Request, Response, NextFunction } from "express"

import * as authService from "../services/auth"
import * as User from "../models/user"

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		const sessionToken = await authService.loginUser(email, password)

		if (!sessionToken) {
			return res.status(403).json({ message: "Invalid password" })
		}

		res.cookie("WS-MANAGER-AUTH", sessionToken)

		const user = await User.getByEmail(email).select("-createdAt -updatedAt").exec()

		return res.status(200).json({ token: sessionToken, user: user })
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}

export const register = async (req: Request, res: Response) => {
	try {
		const { username, password, email } = req.body

		const newUser = await authService.registerUser(username, password, email)

		return res.status(200).json(newUser)
	} catch (err: any) {
		return res.status(500).json({ message: err.message })
	}
}
