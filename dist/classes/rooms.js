"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rooms {
    constructor(roomsData) {
        this.rooms = {};
        this.rooms = roomsData;
    }
    addRoom(roomName, room) {
        this.rooms[roomName] = room;
        return room;
    }
    getRoom(roomName) {
        return this.rooms[roomName];
    }
    getOrCreateRoom(roomName) {
        return this.roomExists(roomName) ? this.getRoom(roomName) : this.addRoom(roomName, { clients: [], schema: null });
    }
    roomExists(roomName) {
        return this.rooms[roomName] !== undefined;
    }
    removeRoom(roomName) {
        delete this.rooms[roomName];
    }
    getAllRooms() {
        return this.rooms;
    }
    addClient(roomName, client) {
        const room = this.getOrCreateRoom(roomName);
        if (!room.clients.includes(client))
            room.clients.push(client);
    }
    removeClient(roomName, client) {
        const room = this.getRoom(roomName);
        room.clients = room.clients.filter(function (obj) {
            return obj !== client;
        });
    }
    addSchema(roomName, schema) {
        const room = this.getOrCreateRoom(roomName);
        room.schema = schema;
    }
    broadcast(roomName, data, msgClient) {
        if (!this.roomExists) {
            throw `Room ${roomName} does not exist`;
        }
        this.getRoom(roomName).clients.forEach(function each(client) {
            if (client != msgClient && client.readyState === 1) {
                client.send(JSON.stringify(data.payload.msg));
                console.log("Data sent to client: " + JSON.stringify(data.payload.msg));
            }
        });
    }
    removeClientFromAllRooms(client) {
        Object.keys(this.rooms).forEach((roomName) => {
            this.removeClient(roomName, client);
        });
    }
}
exports.default = Rooms;
//# sourceMappingURL=rooms.js.map