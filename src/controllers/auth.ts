import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import * as User from "../models/users"

const SECRET = "secret"

export const login = async (req: express.Request, res: express.Response) => {
	try {
		const { email, password } = req.body

		if (!email || !password) return res.sendStatus(400).json({ error: "Missing email or password" })

		const user = await User.getByEmail(email).select("+auth.salt +auth.password")

		if (!user) return res.sendStatus(400)

		const isMatch = await bcrypt.compare(password, user.auth!.password)
		console.log(isMatch)
		if (!isMatch) return res.sendStatus(403)

		const sessionToken = jwt.sign({ id: user._id, email: user.email }, SECRET)

		user.auth!.sessionToken = sessionToken

		await user.save()

		res.cookie("WS-MANAGER-AUTH", user.auth!.sessionToken)

		return res.status(200).json(user).end()
	} catch (error) {
		console.log(error)
		return res.status(400).end()
	}
}

export const register = async (req: express.Request, res: express.Response) => {
	try {
		const { username, password, email } = req.body

		if (!username || !password || !email) return res.sendStatus(400).json({ error: "Missing username, password or email" })

		const existingUser = await User.getByEmail(email)

		if (existingUser) return res.status(400).json({ error: "Username already exists" }).end()

		const user = await User.create({
			email,
			username,
			ws: {},
			auth: {
				password: password,
				salt: null,
				sessionToken: null,
			},
		})

		return res.status(200).json(user).end()
	} catch (error) {
		return res.status(400).json(error).end()
	}
}
