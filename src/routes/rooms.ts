import express from "express"
import { getRoomByName, createRoom, updateRoomName, deleteRoom, addClientToRoom, removeClientToRoom, updateSchema } from "../controllers/rooms"

export default (router: express.Router) => {
	router.get("/namespaces/:namespace/rooms/:roomName", getRoomByName)
	router.post("/namespaces/:namespace/rooms", createRoom)
	router.put("/namespaces/:namespace/rooms/:roomName/name", updateRoomName)
	router.delete("/namespaces/:namespace/rooms/:roomName", deleteRoom)
	router.post("/namespaces/:namespace/rooms/:roomName/client", addClientToRoom)
	router.delete("/namespaces/:namespace/rooms/:roomName/client/:id", removeClientToRoom)
	router.patch("/namespaces/:namespace/rooms/:roomName/schema", updateSchema)
}
