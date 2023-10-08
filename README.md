
# Websocket Control Center

Hi there, this repository is regarding the project and tool backend codebase, if you wish to checkout the frontend codebase:
https://github.com/PedroMiguelAlmeida/WebSocket-AdminUI .

●   A management and administration tool for communications among various users, whether human or machines,
using the WebSocket protocol. 

●   This page will have some schemes and charts detailing some of the functionality or concepts in order to be an easier to read and easier to understand package.


# Project Components

●   The following components were developed to achieve the solution: WebSocket
server, RESTful API, database, web application for WebSocket administration and
management, SDK to facilitate the usage of our solution, and a client applica-
tion for usage examples and testing. 

# Websockets with versatility and control

●   The WebSocket server facilitates real-time
communication between clients. With the aim of extending the native capabilities
of WebSockets, a mechanism for grouping clients into logical subdivisions was
developed. These subdivisions have a hierarchical nature, composed of topics con-
tained within namespaces

●	This provides the user of the tool with the ability to
create and control numerous communication channels. We have also provided the
opportunity to validate the structure and data type sent to the communication
channels, if desired, through the upload of schemas. This allows for greater flexibility
and coverage for different possible use cases of the tool.

# Authentication

●   To authenticate the user establishing a connection, authentication via cookies was developed. In addition to WebSocket functionality, we added the heartbeat function (periodic connection status verification) and the ability to reconnect if a connection unexpectedly closes.

# Database

●   To persist the structure and data of the previously described features, a MongoDB
database was created, leveraging its fast data reading speed and compatibility with
the JSON format.

# SDK

●   Finally, an SDK was created to assist users of the tool in utilizing the WebSocket
server. For testing and example purposes, a simple client application was developed.










## Installation

In order to utilize and modify the project to your needs:

Clone the project:

```bash
  git clone https://github.com/PedroMiguelAlmeida/WebSocket-AdminUI.git
  cd WebSocket-Control-Center
```
Install packages and dependencies:

```bash
  npm install 
```
Compile the project:

```bash
  tsc
```
# Screenshots

### Websocket Lifecycle
![App Screenshot](https://github.com/PedroMiguelAlmeida/WebSocket-Control-Center/blob/main/Screenshots/WSLifeCycle.png?raw=true)

<br/>

### System Architecture
![App Screenshot](https://github.com/PedroMiguelAlmeida/WebSocket-Control-Center/blob/main/Screenshots/ArquiteturaSistema.drawio.png?raw=true)

<br/>

### Comunication Architecture

![App Screenshot](https://github.com/PedroMiguelAlmeida/WebSocket-Control-Center/blob/main/Screenshots/ArquiteturaComunicacao.drawio.png?raw=true)

<br/>

### Architecture Stack

![App Screenshot](https://github.com/PedroMiguelAlmeida/WebSocket-Control-Center/blob/main/Screenshots/ArqTechStack.drawio.png?raw=true)
<br/>

### Class Diagram

![App Screenshot](https://github.com/PedroMiguelAlmeida/WebSocket-Control-Center/blob/main/Screenshots/ClassDiagram.png?raw=true)
<br/>

### Sending Data Sequence diagram

![App Screenshot](https://github.com/PedroMiguelAlmeida/WebSocket-Control-Center/blob/main/Screenshots/SendingData.drawio.png?raw=true)
<br/>


### Example of SDK process

![App Screenshot](https://github.com/PedroMiguelAlmeida/WebSocket-Control-Center/blob/main/Screenshots/SequenceDiagram-WebsocketSDK.drawio.png?raw=true)
<br/>

For more diagrams on project processes refer to the Screenshots directory in the project folder.







## API Reference

Admins can call the expressJS RESTful api, we decided to perform this actions through RESTful API and not WebSocket so we can maximize WebSocket performance when sending data.

#### API Table Namespaces

 | Function  | Endpoint| Description                |
 | :-------- | :-------|:------------------------- |
 | GET       | api/namespaces/<namespace>   | Get a namespace |
 | GET         | api/namespaces               | Get all namespaces |
 | POST        | api/namespaces               | Create a namespace
 | PUT         | api/namespaces/<namespace>   | Update a namespace |
 | DELETE      | api/namespaces/<namespace>   | Deletes a namespace |
 | POST        | api/namspaces/<namespace>/clients/<clientId> | Add a client to namespace
 | DELETE | api/namespaces/<namespace>/clients/<clientId> | Removes a client from namespace |
 | POST | api/namespaces/<namespace>/broadcast | Sends a message to all clients within the namespace |

#### API  Table Topics

 | Function  | Endpoint | Description|
 | :-------- | :-------| :------------------------- |
 | GET       | api/namespaces/<namespace>/topics/<topicName>   | Get a topic within the namespace |
 | GET         | api/namespaces/<namespace>/topics               | Get all topics within the namespace |
 | POST        | api/namespaces/<namespace>/topics              | Create a topic within the namespace
 | PATCH         | api/namespaces/<namespace>/topics/<topicName>   | Updates topic name |
 | DELETE      | api/namespaces/<namespace>/topics/<topicName>   | Delete topic from this namespace |
 | POST        | api/namspaces/<namespace>/topics/<topicName>/clients/<clientId>  | Add a client to topic |
 | DELETE | api/namespaces/<namespace>/clients/<clientId> | Removes a client from topic |
 | PATCH | api/namespaces/<namespace>/topics/<topicName>/schema | Updates topic schema |
 | POST | api/namespaces/<namespace>/topics/<topicName>/broadcast | Sends message to all clients within this topic |

### API Auth Table

 | Function  | Endpoint| Description                |
 | :-------- | :-------|:------------------------- |
 | POST | api/auth/login | Validates user e-mail and password, answering with a token |
 | POST | api/auth/register | Create a user |

