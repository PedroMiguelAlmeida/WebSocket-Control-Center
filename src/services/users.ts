import * as User from "../models/users"

export const getAllUsers = async () => {
	try {
		const users = await User.getAll()

		return users
	} catch (error) {
		throw new Error("Failed to retrieve the room")
	}
}
