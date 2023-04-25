const App = require("../models/topics.ts")

//Find a single topic from the database
exports.findOne = (req:any,res:any)=>{
    App.findById(req.params.topicName)
    .then((data:string) =>{
        if (!data) {
            return res.status(404).send({
                message: "Topic with this name not found" + req.params.topicName,
            });
        }
        res.send(data);
    })
}