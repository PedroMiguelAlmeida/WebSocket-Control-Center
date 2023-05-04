//import { db } from '../db'
import mongoose, {Document, Schema} from "mongoose";


export interface IRoom {
    roomName: string;
    namespace: string;
    clients: object[];
    schema: string | null;
}


const RoomSchema = new mongoose.Schema({
    roomName: {type: String, required: true},
    namespace: {type: String, required: true},
    clients: {type: Array, required: true},
    roomSchema: {type: String, required: false},
})


export const RoomModel = mongoose.model('Room', RoomSchema)

RoomSchema.index({ 'roomName': 1, 'namespace': 1 }, {unique: true ,background: true})


export const getByNamespace = (namespace: string) => RoomModel.find({namespace: namespace})

export const getByName = (namespace: string, roomName: string) => RoomModel.findOne({namespace: namespace, roomName: roomName}) 

export const exists = (namespace: string, roomName: string) => RoomModel.findOne({ namespace: namespace, roomName: roomName}).select({ _id: 1 }).lean()

export const create = (room: IRoom) => new RoomModel(room).save().then((room) => room.toObject())

export const update = (namespace: string, roomName: string, room: IRoom) => RoomModel.findOneAndUpdate({namespace: namespace, roomName: roomName}, room)

export const remove = (namespace: string, roomName: string) => RoomModel.deleteOne({namespace: namespace, roomName: roomName})

export const addClient = (namespace: string, roomName: string, client: object) => RoomModel.findOneAndUpdate({namespace: namespace, roomName: roomName, clients: {$ne: client}}, {$push: {clients: client}})

export const removeClient = (namespace: string, roomName: string, clientId: string) => RoomModel.findOneAndUpdate({namespace: namespace, roomName: roomName}, {$pull: {clients: {id: clientId}}})

export const updateSchema = (namespace: string, roomName: string, schema: string) => RoomModel.findOneAndUpdate({namespace: namespace, roomName: roomName}, {roomSchema: schema})

/*
export const getRoomByName = async (namespace: string, roomName: string) => {
    return await db.collection('rooms').findOne({namespace: namespace, "rooms.roomName": roomName}, {projection: {"rooms.$": 1}})
}

export const addRoomToNamespace = async (namespace: string | null, room: IRoom) => {
    if(!namespace) 
        namespace = 'namespaceDefault'
    return await db.collection('rooms').updateOne({namespace: namespace, "rooms.roomName": {$ne: room.roomName}}, {$push: {rooms: room}})
}

export const updateRoomByName = async (namespace: string | null, roomName: string, room: IRoom) => {
    return await db.collection('rooms').updateOne({namespace: namespace, "rooms.roomName": roomName}, {$set: {"rooms.$": room}})
}

export const deleteRoomByName = async (namespace: string, roomName: string) => {
    return await db.collection('rooms').updateOne({namespace: namespace}, {$pull: {rooms: {roomName: roomName}}})
}

export const addClientToRoom = async (namespace: string, roomName: string, client: object) => {
    await db.collection('rooms').updateOne({namespace: namespace, "rooms.roomName": roomName, "rooms.clients": {$ne: client}}, {$push: {"rooms.$.clients": client}})
}

export const removeClientFromRoom = async (namespace: string, roomName: string, clientId: string) => {
    return await db.collection('rooms').updateOne({namespace: namespace, "rooms.roomName": roomName}, {$pull: {"rooms.$.clients": {id: clientId}}})
}

export const updateRoomSchema = async (namespace: string, roomName: string, schema: string) => {
    return await db.collection('rooms').updateOne({namespace: namespace, "rooms.roomName": roomName}, {$set: {"rooms.$.roomSchema": schema}})
}

*/






