import express from 'express'
import { getRoomByName, getRoomByNamespace, createRoom, updateRoom, deleteRoom } from '../controllers/rooms'


export default (router: express.Router) => {
    router.get('/namespace/:namespace/room/:roomName', getRoomByName)
    router.get('/namespace/:namespace', getRoomByNamespace)
    router.post('/namespace/:namespace/room', createRoom)    
    router.put('/namespace/:namespace/room/:roomName', updateRoom)
    router.delete('/namespace/:namespace/room/:roomName', deleteRoom)
    /*
    router.post('/namespace/:namespace/room/:roomName/client', addClient)
    router.delete('/namespace/:namespace/room/:roomName/client/:id', removeClient)
    router.patch('/namespace/:namespace/room/:roomName/schema', patchRoomSchema)*/
}