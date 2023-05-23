import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as User from "../models/users"

export const loginUser = async (email: string, password: string) => {
	try {
		if (!email || !password) {
			throw new Error("Missing email or password")
		}

		const user = await User.getByEmail(email).select("+password")

		if (!user) throw new Error("User not found")

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) return null

		const sessionToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string)

		return sessionToken
	} catch (err) {
		throw new Error("Failed to login user")
	}
}

export const registerUser = async (username: string, password: string, email: string) => {
	try {
		if (!username || !password || !email) {
			throw new Error("Missing username, password, or email")
		}

		const existingUser = await User.getByEmail(email)

		if (existingUser) {
			throw new Error("Username already exists")
		}

		const newUser = await User.create({ email, username, password } as User.IUser)

		return newUser
	} catch (err) {
		throw new Error("Failed to register user")
	}
}
