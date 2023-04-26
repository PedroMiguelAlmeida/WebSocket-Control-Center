import { db } from '../db'

interface ITopics {
    topicName: string;
    subscribers: object[];
    publishers: object[];
    topicSchema: string | null;
}

interface IRoom {
    roomName: string;
    clients: object[];
    roomSchema: string | null;
    topics: ITopics[];
}

export const getRoomByName = async (namespace: string, roomName: string) => {
    return await db.collection('rooms').findOne({namespace: namespace, "rooms.roomName": roomName}, {projection: {"rooms.$": 1}})
}

export const addRoomToNamespace = async (namespace: string, room: IRoom) => {
    return await db.collection('rooms').updateOne({namespace: namespace}, {$push: {rooms: room}})
}

export const updateRoomByName = async (namespace: string, roomName: string, room: IRoom) => {
    return await db.collection('rooms').updateOne({namespace: namespace, "rooms.roomName": roomName}, {$set: {"rooms.$": room}})
}

export const deleteRoomByName = async (namespace: string, roomName: string) => {
    return await db.collection('rooms').updateOne({namespace: namespace}, {$pull: {rooms: {roomName: roomName}}})
}

export const addClientToRoom = async (namespace: string, roomName: string, client: object) => {
    return await db.collection('rooms').updateOne({namespace: namespace, "rooms.roomName": roomName}, {$push: {"rooms.$.clients": client}})
}

export const removeClientFromRoom = async (namespace: string, roomName: string, clientId: string) => {
    console.log(clientId)
    return await db.collection('rooms').updateOne({namespace: namespace, "rooms.roomName": roomName}, {$pull: {"rooms.$.clients": {id: clientId}}})
}







