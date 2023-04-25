module.exports = (app:any) =>{
    const App = require("../controllers/topicsController.ts")
    
    app.post("/createTopic",App.create);
    
    app.get("/getAllTopics",App.findAll);

    app.get("/topic/:topicName",App.getTopic(":topicName"))

    app.put("/topic/:topicName",App.update)

    app.delete("/topic/:topicName",App.delete)
}