interface clientData {
  roomName: string;
  payload: {
    msg: string;
  }
}

type Room = {
  clients: object[];
  schema: string | null;
};

type RoomsData = Record<string, Room>;

export default class Rooms {
  private rooms: RoomsData = {};

  constructor(roomsData: RoomsData) {
    this.rooms = roomsData;
  }

  public addRoom(roomName: string, room: Room): void {
    this.rooms[roomName] = room;
  }

  public getRoom(roomName: string): Room {
    const room = this.rooms[roomName];
    if (!room) {
      throw `Room ${roomName} does not exist`;
    }
    return room;
  }

  public roomExists(roomName: string): boolean {
    return this.rooms[roomName] !== undefined;
  }

  public removeRoom(roomName: string): void {
    delete this.rooms[roomName];
  }

  public getAllRooms(): RoomsData {
    return this.rooms;
  }

  public addClient(roomName: string, client: object): void {
    const room = this.getRoom(roomName);

    if (!room.clients.includes(client))
      room.clients.push(client);
  }

  public removeClient(roomName: string, client: object): void {
    const room = this.getRoom(roomName);
    room.clients = room.clients.filter(function (obj) {
      return obj !== client;
    });
  }

  public addSchema(roomName: string, schema: string): void {
    const room = this.getRoom(roomName);
    room.schema = schema;
  }

  public broadcast(roomName: string, data: clientData, msgClient: object) {
    this.getRoom(roomName).clients.forEach(function each(client: any) {
      if (client != msgClient && client.readyState === 1) {
        client.send(JSON.stringify(data.payload.msg))
        console.log("Data sent to client: " + JSON.stringify(data.payload.msg))
      }
    })
  }

  public removeClientFromAllRooms(client: object): void {
    Object.keys(this.rooms).forEach((roomName) => {
      this.removeClient(roomName, client);
    });
  }
  
}


