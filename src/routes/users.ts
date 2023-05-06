import express from "express"

import { getAllUsers } from "../controllers/users"
import { isAuth } from "../middleware"

export default (router: express.Router) => {
	router.get("/users", isAuth, getAllUsers)
}
