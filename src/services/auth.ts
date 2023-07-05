import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as User from "../models/user"

export const loginUser = async (email: string, password: string) => {
	try {
		if (!email || !password) {
			throw new Error("Missing email or password")
		}

		const user = await User.getByEmail(email).select("+password")

		if (!user) throw new Error("User not found")

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) throw new Error("Invalid password")

		const sessionToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string)

		if (!sessionToken) throw new Error("Failed to create session token")

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

export const isAuth = async (token: string) => {
	try {
		if (!token) throw new Error("Missing token")

		const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload

		if (!decoded) throw new Error("Invalid token")

		const user = await User.getById(decoded.id)

		if (!user) throw new Error("User not found")

		return user
	} catch (err) {
		throw err
	}
}
