import express from "express"
import rooms from "./rooms"
import namespace from "./namespace"
import auth from "./auth"
import users from "./users"

const router = express.Router()

export default (): express.Router => {
	rooms(router)
	namespace(router)
	auth(router)
	users(router)

	return router
}
