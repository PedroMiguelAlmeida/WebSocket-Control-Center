
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const { receiveMessageOnPort } = require('worker_threads');
const { type } = require('os');


const PORT = 8080;

const wss = new WebSocket.Server({ port: 3002 });

let sentDataHistory = new Array();

// if (sentDataHistory.length>=1){

//   switch (typeof(sentDataHistory[0])) {
//     case 'string':
//       var sentdataSchema = {
//         "$schema": "https://json-schema.org/draft/2020-12/schema", 
//         "type" : "object",
//         "required" : ["user","message"],
//         "properties" : {
//           "user" : {
//             "description" : "Identifies the user",
//             "type" : "string"
//           },
//           "message" : {
//             "description" : "the message itself",
//             "type" : "string"
//           }
//         }
//       }
//       break;
//     case 'integer':
//       var sentdataSchema = {
//         "$schema": "https://json-schema.org/draft/2020-12/schema", 
//         "type" : "object",
//         "required" : ["user","message"],
//         "properties" : {
//           "user" : {
//             "description" : "Identifies the user",
//             "type" : "string"
//           },
//           "message" : {
//             "description" : "the message itself",
//             "type" : "integer"
//           }
//         }
//       }
//       break;
//     case 'float':
//       var sentdataSchema = {
//         "$schema": "https://json-schema.org/draft/2020-12/schema", 
//         "type" : "object",
//         "required" : ["user","message"],
//         "properties" : {
//           "user" : {
//             "description" : "Identifies the user",
//             "type" : "string"
//           },
//           "message" : {
//             "description" : "the message itself",
//             "type" : "float"
//           }
//         }
//       }
//       break;
//     default:
//       return "Didnt match any schema type";
//   }

// }

var Validator = require('jsonschema').Validator;
var validator = new Validator();

function getSupportedMessageType(message) {
  const messageType = typeof (message);
  switch (messageType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    // case 'integer':
    //   return 'integer';
    // case 'float': 
    //   return 'float';
    default:
      throw new Error(`${messageType} is not supported`);
  }
}

wss.on('connection', function connection(ws) {
  //console.log(`Length before sending a new message ${sentDataHistory.length}`);
  ws.on('message', function incoming(data) {
    parsedData = JSON.parse(data);
    sentDataHistory.push(parsedData);
    //console.log(`Data history: ${sentDataHistory.toString()}`);
    // console.log(`Data type ${typeof(sentDataHistory)}`)
    // console.log(`Length after sending a new message ${sentDataHistory.length}`);
    //console.log(parsedData);
    console.log(sentDataHistory[0].payload.message);
    console.log(getSupportedMessageType(sentDataHistory[0].payload.message));
    let schema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "type": "object",
      "required": ["payload"],
      "properties": {
        "payload": {
          "type": "object",
          "required": ["user", "message"],
          "properties": {
            "user": {
              "description": "Identifies the user",
              "type": "string"
            },
            "message": {
              "description": "the message itself",
              "type": getSupportedMessageType(sentDataHistory[0].payload.message)
            }
          }
        },
      }
    }
    let validateResolve = validator.validate(parsedData, schema);
    // console.log(`VALIDATION ${validateResolve.valid}`);
    console.log(validateResolve.errors);
    console.log(schema.properties.payload);
    console.log(parsedData);
    if (!validateResolve.valid) {
      ws.send(JSON.stringify({
        "type": "error",
        "payload": {
          "message": "Message isnt of the right type for this chat"
        }
      }))
      return;
    }
    wss.clients.forEach(function each(client) {
      //console.log(wss.clients) //Shows SET data structure which wss uses to store every ws
      if (client != ws && client.readyState === WebSocket.OPEN) {
        //client.send(data.toString());
        // client.send(JSON.parse(data).payload.message);
        console.log(sentDataHistory[0].payload.message);
        client.send(JSON.stringify(parsedData));
        console.log(`Data sent by client: ${data}`)
      }
    })
  })
})

//mounting http server for index.html
fs.readFile('./index.html', function (error, html) {
  if (error) throw error;
  http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(html);
    response.end();
  }).listen(PORT);
});
