
/*
app.get("/topics/:topicName", async (_req, res) => {
    let topicName = _req.params.topicName;
    console.log("Api get topic");
    let topics: any = await topicsModel.getTopic(topicName);
    res.status(200).send(topics);
  });
  
  app.get("/topics", async (_req, res) => {
    let topics: any = await topicsModel.getAllTopics();
    res.status(200).send(topics);
  });
  
  app.put("/uploadTopicSchema/:topicName", async (_req, res) => {
    let topicName = _req.params.topicName;
    let schema = _req.body.schema;
    let uploadedSchemaRes = await topicsModel.uploadTopicSchema(
      topicName,
      schema
    );
    res.status(200).send(uploadedSchemaRes);
    
  });
  
  app.delete("/deleteTopic", async (req, res) => {
    let topicName = req.body.topicName;
    topicsModel.deleteTopic(topicName);
    res.send("Topic deleted");
  });
  
  app.post("/addTopic", (req, res) => {
    try {
      let roomName = req.body.roomName;
      let topicName = req.body.topicName;
  
      topicsModel.addTopic(roomName, topicName);
      res.send("Topic saved!");
    } catch (err) {
      res.status(400).send(err);
    }
  });*/