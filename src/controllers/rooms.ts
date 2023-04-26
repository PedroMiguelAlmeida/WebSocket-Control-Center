import express from 'express'
import { getRoomByName, addRoomToNamespace, updateRoomByName, deleteRoomByName, addClientToRoom, removeClientFromRoom, updateRoomSchema } from '../models/rooms'

export const getRoom = async (req: express.Request, res: express.Response) => {
    try{
        const room = await getRoomByName(req.params.namespace, req.params.roomName)
        
        return res.status(200).json(room)
        
    } catch (err: any) {
        return res.status(404).json({message: err.message})
    }
}

export const addRoom = async (req: express.Request, res: express.Response) => {
    try{
        const newRoom = await addRoomToNamespace(req.params.namespace, req.body)
        
        return res.status(201).json(newRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }
}

export const updateRoom = async (req: express.Request, res: express.Response) => {
    try{
        const updatedRoom = await updateRoomByName(req.params.namespace, req.params.roomName, req.body)
        
        return res.status(200).json(updatedRoom)
        
    }
    catch (err: any) {
        return res.status(400).json({message: err.message})
    }
}

export const deleteRoom = async (req: express.Request, res: express.Response) => {
    try{
        const deletedRoom = await deleteRoomByName(req.params.namespace, req.params.roomName)
        
        return res.status(200).json(deletedRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

export const addClient = async (req: express.Request, res: express.Response) => {
    try{
        const client = req.body

        const updatedRoom = await addClientToRoom(req.params.namespace, req.params.roomName, client)
        
        return res.status(200).json(updatedRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

export const removeClient = async (req: express.Request, res: express.Response) => {
    try{
        const clientId = req.params.id

        const updatedRoom = await removeClientFromRoom(req.params.namespace, req.params.roomName, clientId)
        
        return res.status(200).json(updatedRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

export const patchRoomSchema = async (req: express.Request, res: express.Response) => {
    try{
        const schema = req.body

        const updatedRoom = await updateRoomSchema(req.params.namespace, req.params.roomName, schema)
        
        return res.status(200).json(updatedRoom)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}
