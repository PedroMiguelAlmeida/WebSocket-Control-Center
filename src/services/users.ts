import * as User from "../models/user"

export const getAllUsers = async () => {
	try {
		const users = await User.getAll()

		return users
	} catch (error) {
		throw new Error("Failed to retrieve the topic")
	}
}
