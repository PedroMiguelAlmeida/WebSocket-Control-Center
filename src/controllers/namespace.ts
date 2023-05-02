import express from 'express'
import { getNamespaceByName, createNamespace, updateNamespaceByName, deleteNamespaceByName } from '../models/namespace'

export const getNamespace = async (req: express.Request, res: express.Response) => {
    try{
        const namespace = await getNamespaceByName(req.params.namespace)
        
        return res.status(200).json(namespace)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

export const createNewNamespace = async (req: express.Request, res: express.Response) => {
    try{
        const namespace = await createNamespace(req.body)
        
        return res.status(200).json(namespace)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

export const updateNamespace = async (req: express.Request, res: express.Response) => {
    try{
        const updatedNamespace = await updateNamespaceByName(req.params.namespace, req.body)
        
        return res.status(200).json(updatedNamespace)
        
    }
    catch (err: any) {
        return res.status(400).json({message: err.message})
    }
}

export const deleteNamespace = async (req: express.Request, res: express.Response) => {
    try{
        const namespace = await deleteNamespaceByName(req.params.namespace)
        
        return res.status(200).json(namespace)
        
    } catch (err: any) {
        return res.status(400).json({message: err.message})
    }    
}

