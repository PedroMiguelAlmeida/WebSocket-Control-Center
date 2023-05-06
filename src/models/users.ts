import mongoose from "mongoose"
import bcrypt from "bcrypt"

const SALT_WORK_FACTOR = 10

export interface IUser {
	email: string
	username: string
	ws: object
	auth: {
		password: string
		salt: string | null
		sessionToken: string | null
	}
}

// User Config
const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true },
	ws: { type: Object, required: false },
	auth: {
		password: { type: String, required: true, select: false },
		salt: { type: String, select: false },
		sessionToken: { type: String, select: false },
	},
})

UserSchema.pre("save", async function save(next) {
	if (!this.isModified("auth.password")) return next()
	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
		this.auth!.password = await bcrypt.hash(this.auth!.password, salt)
		this.auth!.salt = salt
		return next()
	} catch (err) {
		return next()
	}
})

export const UserModel = mongoose.model("User", UserSchema)

// User Actions
export const getAll = () => UserModel.find()
export const getByUsername = (username: string) => UserModel.findOne({ username })
export const getByEmail = (email: string) => UserModel.findOne({ email })
export const getBySessionToken = (sessionToken: string) => UserModel.findOne({ "auth.sessionToken": sessionToken })
export const getById = (id: string) => UserModel.findById(id)
export const create = (user: IUser) => new UserModel(user).save().then((user) => user.toObject())
export const deleteById = (id: string) => UserModel.findOneAndDelete({ _id: id })
export const updateById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)
