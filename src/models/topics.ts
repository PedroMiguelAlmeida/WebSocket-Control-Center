
import { db } from '../db.js'

// type Topic = {
//     roomName : string;
//     publishers: object[];
//     subscribers: object[];
//     schema: string | null;
// }

// type TopicsData = Record<string, Topic>;

export default class Topics {

    roomName: string;
    topicName: string;
    schema: string;
    // publishers:object[];
    // subscribers:object[];

    constructor(roomName: string, topicName: string) {
        this.roomName = roomName;
        this.topicName = topicName;
        this.schema = "";
        // this.publishers:[];
        // this.subscribers:[]
    }

    public async getAllTopics() {
        return await db.collection('topics').find().toArray;
    }

    public topicExists(topicName: string) {
        if (db.collection('topics').find({ "topicName": topicName })) {
            return true;
        }
        else {
            return false;
        }
    }

    public addTopic(roomName: string, topicName: string) {
        if (!this.topicExists(topicName)) {
            return "Topic does not exist"
        }
        db.collection('topics').insertOne({
            "roomName": roomName,
            "topicName": topicName
        })
        return "Topic was inserted successfully"
    }

    public async getTopic(topicName: string) {
        return await db.collection('topics').findOne({
            "topicName": topicName
        })
    }

    public deleteTopic(topicName: string) {
        try {
            db.collection('topics').deleteOne({ "topicName": topicName })
        } catch (error) {
            console.log(error)
        }
    }

    public async uploadTopicSchema(topicName: string, schema: string) {
        if (!this.topicExists(topicName)) {
            return "Topic does not exist"
        }
        await db.collection('topic').updateOne(
            {
                "topicName": topicName
            }, {
            $set: { "schema": schema }
        });
        return "Schema uploaded to topic";
    }



    // public addSubscriber(topicName: string,subscriber: object): void{
    //     const topic = this.topics[topicName]

    //     if (!topic.subscribers.includes(subscriber)) {
    //         topic.subscribers.push(subscriber);
    //     }
    // }

}