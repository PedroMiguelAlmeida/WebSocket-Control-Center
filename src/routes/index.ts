import express from "express"
import topics from "./topics"
import namespace from "./namespace"
import auth from "./auth"
import users from "./users"

const router = express.Router()

export default (): express.Router => {
	topics(router)
	namespace(router)
	auth(router)
	users(router)

	return router
}
