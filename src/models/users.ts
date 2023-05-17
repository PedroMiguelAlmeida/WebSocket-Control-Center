import mongoose, { Document, Model } from "mongoose"
import bcrypt from "bcrypt"

const SALT_WORK_FACTOR = 10

export interface IUser {
	email: string
	username: string
	password: string
	ws: object | null
}

export interface IUserDocument extends IUser, Document {
	createdAt: Date
	updatedAt: Date
}

// User Config
const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		username: { type: String, required: true },
		password: { type: String, required: true, select: false },
		ws: { type: Object, required: false },
	},
	{ timestamps: true }
)

UserSchema.pre("save", async function save(next) {
	if (!this.isModified("auth.password")) return next()
	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
		this.password = await bcrypt.hash(this.password, salt)
		return next()
	} catch (err) {
		return next()
	}
})

export const User = mongoose.model<IUserDocument>("User", UserSchema)

// User Actions
export const getAll = () => User.find()
export const getByUsername = (username: string) => User.findOne({ username })
export const getByEmail = (email: string) => User.findOne({ email })
export const getById = (id: string) => User.findById(id)
export const create = (user: IUser) => new User(user).save().then((user) => user.toObject())
export const deleteById = (id: string) => User.findOneAndDelete({ _id: id })
export const updateById = (id: string, values: Record<string, any>) => User.findByIdAndUpdate(id, values)
export const exists = (id: string) => User.exists({ _id: id })
