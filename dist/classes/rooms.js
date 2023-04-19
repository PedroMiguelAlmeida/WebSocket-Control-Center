"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rooms {
    constructor(roomsData) {
        this.rooms = {};
        this.rooms = roomsData;
    }
    addRoom(roomName, room) {
        this.rooms[roomName] = room;
    }
    getRoom(roomName) {
        const room = this.rooms[roomName];
        if (!room) {
            throw `Room ${roomName} does not exist`;
        }
        return room;
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
        const room = this.getRoom(roomName);
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
        const room = this.getRoom(roomName);
        room.schema = schema;
    }
    broadcast(roomName, data, msgClient) {
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