import { MongoClient, Db } from "mongodb";

const url = "mongodb://127.0.0.1:27017/";
const defaultDbName = "wsManager";

const client = new MongoClient(url);



export const connectToDb = async (dbName: string = defaultDbName) => {
    const conn = await client.connect();
    db = conn.db(dbName);
    if(db){
        console.log(`Connected to db ${dbName}`);
    }
    
    return client;
}

export let db: Db;
