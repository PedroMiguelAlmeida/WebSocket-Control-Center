import mongoose, { Document, Model } from "mongoose"
import bcrypt from "bcrypt"

const SALT_WORK_FACTOR = 10

export interface IUser extends Document {
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
const UserSchema = new mongoose.Schema<IUser>(
	{
		email: { type: String, required: true, unique: true },
		username: { type: String, required: true },
		ws: { type: Object, required: false },
		auth: {
			password: { type: String, required: true, select: false },
			salt: { type: String, select: false },
			sessionToken: { type: String, select: false },
		},
	},
	{ timestamps: true }
)

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

export const User: Model<IUser> = mongoose.model("User", UserSchema)

// User Actions
export const getAll = () => User.find()
export const getByUsername = (username: string) => User.findOne({ username })
export const getByEmail = (email: string) => User.findOne({ email })
export const getBySessionToken = (sessionToken: string) => User.findOne({ "auth.sessionToken": sessionToken })
export const getById = (id: string) => User.findById(id)
export const create = (user: IUser) => new User(user).save().then((user) => user.toObject())
export const deleteById = (id: string) => User.findOneAndDelete({ _id: id })
export const updateById = (id: string, values: Record<string, any>) => User.findByIdAndUpdate(id, values)
