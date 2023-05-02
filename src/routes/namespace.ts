import express from 'express'
import { getNamespace, createNewNamespace, updateNamespace, deleteNamespace } from '../controllers/namespace'

export default (router: express.Router) => {
    router.get('/namespace/:namespace', getNamespace)
    router.post('/namespace', createNewNamespace)
    router.put('/namespace/:namespace', updateNamespace)
    router.delete('/namespace/:namespace', deleteNamespace)
}
