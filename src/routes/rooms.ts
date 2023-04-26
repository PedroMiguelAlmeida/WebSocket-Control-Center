import express from 'express'
import { getRoom, addRoom, updateRoom, deleteRoom, removeClient, patchRoomSchema, addClient } from '../controllers/rooms'


export default (router: express.Router) => {
    router.get('/namespace/:namespace/room/:roomName', getRoom)
    router.post('/namespace/:namespace/room', addRoom)
    router.put('/namespace/:namespace/room/:roomName', updateRoom)
    router.delete('/namespace/:namespace/room/:roomName', deleteRoom)
    router.post('/namespace/:namespace/room/:roomName/client', addClient)
    router.delete('/namespace/:namespace/room/:roomName/client/:id', removeClient)
    router.patch('/namespace/:namespace/room/:roomName/schema', patchRoomSchema)
}