import { db } from "../db.js";

interface publisherData {
  topicName: string;
  payload: {
    msg: string;
  };
}
type Topic = {
  roomName: string;
  publishers: object[];
  subscribers: object[];
  schema: string | null;
};

// type TopicsData = Record<string, Topic>;

export default class Topics {
  //   roomName: string;
  //   topicName: string;
  //   schema: string;
  //   publishers: object[];
  //   subscribers: object[];

  //   constructor() {
  //     this.roomName = roomName;
  //     this.topicName = topicName;
  //     this.schema = "";
  //     this.publishers:[];
  //     this.subscribers:[]
  //   }

  public async getAllTopics() {
    return await db.collection("topics").find().toArray();
  }

  public async getTopic(topicName: string) {
    return await db.collection("topics").findOne({
      topicName: topicName,
    });
  }

  public topicExists(topicName: string) {
    if (db.collection("topics").find({ topicName: topicName })) {
      return true;
    } else {
      return false;
    }
  }

  public addTopic(roomName: string, topicName: string) {
    if (!this.topicExists(topicName)) {
      return "Topic does not exist";
    }
    db.collection("topics").insertOne({
      roomName: roomName,
      topicName: topicName,
    });
    return "Topic was inserted successfully";
  }

  public deleteTopic(topicName: string) {
    try {
      db.collection("topics").deleteOne({ topicName: topicName });
    } catch (error) {
      console.log(error);
    }
  }

  public async uploadTopicSchema(topicName: string, schema: string) {
    if (!this.topicExists(topicName)) {
      return "Topic does not exist";
    }
    console.log(topicName);
    console.log(schema);
    await db.collection("topics").updateOne(
      {
        topicName: topicName,
      },
      {
        $set: { schema: schema },
      }
    );

    return "Schema uploaded to topic";
  }

  //   public broadcast(
  //     topicName: string,
  //     data: publisherData,
  //     msgPublisher: object
  //   ) {
  //     if (!this.topicExists) {
  //       throw `Topic ${topicName} does not exist`;
  //     }
  //     this.getTopic(topicName).publishers.forEach(function each(publisher: any) {
  //       if (publisher != msgPublisher && publisher.readyState === 1) {
  //         publisher.send(JSON.stringify(data.payload.msg));
  //         console.log(
  //           "Data sent to subscribers: " + JSON.stringify(data.payload.msg)
  //         );
  //       }
  //     });
  //   }

  // public addSubscriber(topicName: string,subscriber: object): void{
  //     const topic = this.topics[topicName]

  //     if (!topic.subscribers.includes(subscriber)) {
  //         topic.subscribers.push(subscriber);
  //     }
  // }
}
