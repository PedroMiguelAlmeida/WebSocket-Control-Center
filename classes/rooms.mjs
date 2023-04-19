export default class Rooms{
    constructor() {
        this.rooms = new Map();
    }

    addRoom(roomName, clients, schema) {
        //rooms[roomName] = { clients: clients, schema: schema };
        this.rooms.set(roomName, { clients: clients, schema: schema });
    }

    getRoom(roomName) {
        //return rooms[roomName];

        if (!this.rooms.has(roomName)) {
            throw new Error(`Room ${roomName} does not exist`);
        }
        return this.rooms.get(roomName);
    }

    removeRoom(roomName) {
        //delete rooms[roomName];
        this.rooms.delete(roomName);
    }

    getAllRooms() {
        return this.rooms;
    }

    addClient(roomName, client) {
        //rooms[roomName].clients.push(client);
        this.getRoom(roomName).clients.push(client);
    }
    

    removeClient(roomName, client) {
        //rooms[roomName].clients = rooms[roomName].clients.filter(function (obj) {
        //    return obj !== client;
        //});
        this.getRoom(roomName).clients = this.getRoom(roomName).clients.filter(function (obj) {
            return obj !== client;
        });
    }

    addSchema(roomName, schema) {
        //rooms[roomName].schema = schema;
        this.rooms.get(roomName).schema = schema;
    }


}
/*
try {
    const rooms = new Rooms();

    rooms.addRoom("room1", [], null);
    rooms.addRoom("room2", [], "schemam2");

    rooms.addClient("room1", "client1");
    rooms.addClient("room1", "client2");
    rooms.addSchema("room1", "schema1");

    //rooms.addClient("room3", "client1");

    rooms.removeClient("room1", "client1");

    console.log(rooms.getAllRooms());


} catch (e) {
    console.error(e);
}
*/