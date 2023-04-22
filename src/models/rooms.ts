import { db } from '../db.js'

type Room = {
    roomName: string;
    clients: object[];
    schema: string | null;
  }
export default class Rooms {

    constructor(){
        
    }

    public async getAllRooms(){
        return await db.collection('rooms').find().toArray();
    }
 
    public async getRoom(roomName: string): Promise<any | null> {
        console.log(roomName);
        try{
            let room = await db.collection('rooms').findOne({roomName : 'room1'})
            return  room || null
        }catch(err){
            console.log(err)
            return null;
        }
        
    }

}

