import express from 'express'
import rooms from './rooms'
import namespace from './namespace'


const router = express.Router()

export default (): express.Router => {

    rooms(router)
    namespace(router)

    return router
}