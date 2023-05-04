import {Request, Response, NextFunction} from 'express'
import * as Room from '../models/rooms'

export const getRoomByName = async (req: Request, res: Response) => {
    try{
        const room = await Room.getByName(req.params.namespace, req.params.roomName)

        if(!room)
            return res.status(404).json({message: 'room doesn\'t exist'})
        
        return res.status(200).json(room)
        
    } catch (err: any) {
        return res.status(404).json({message: err.message})
    }
}

export const getRoomByNamespace = async (req: Request, res: Response) => {
    try{
        const rooms = await Room.getByNamespace(req.params.namespace)

        if(!rooms)
            return res.status(404).json({message: 'namespace doesn\'t exist'})
        
        return res.status(200).json(rooms)
        
    } catch (err: any) {
        return res.status(404).json({message: err.message})
    }
}

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {roomName, schema} = req.body
        const namespace = req.params.namespace
        const clients = [{}]

        if(!roomName)
            return res.status(400).json({message: 'roomName is required'})

        const room = await Room.getByName(namespace, roomName)

        if(room)
            return res.status(400).json({message: 'room already exists'})
            
        const newRoom = await Room.create({roomName, namespace, clients, schema})
        
        return res.status(201).json(newRoom).end()
    } catch (err: any) {
        return res.status(404).json({message: err.message})
    }   
}

export const updateRoom = async (req: Request, res: Response) => {
    try{

        const updatedRoom = await Room.update(req.params.namespace, req.params.roomName, req.body)
        
        return res.status(200).json(updatedRoom)
        
    }
    catch (err: any) {
        return res.status(400).json({message: err.message})
    }
}

export const deleteRoom = async (req: Request, res: Response) => {
    try{
        const deletedRoom = await Room.remove(req.params.namespace, req.params.roomName)
        
        return res.status(200).json(deletedRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

export const addClient = async (req: Request, res: Response) => {
    try{
        const client = req.body

        const updatedRoom = await Room.addClient(req.params.namespace, req.params.roomName, client)
        
        return res.status(200).json(updatedRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

export const removeClient = async (req: Request, res: Response) => {
    try{
        const clientId = req.params.id

        const updatedRoom = await Room.removeClient(req.params.namespace, req.params.roomName, clientId)
        
        return res.status(200).json(updatedRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

export const patchRoomSchema = async (req: Request, res: Response) => {
    try{
        const { schema } = req.body

        const updatedRoom = await Room.updateSchema(req.params.namespace, req.params.roomName, schema)
        
        return res.status(200).json(updatedRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}
