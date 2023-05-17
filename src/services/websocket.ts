import { WebSocketServer } from "ws"

interface clientData {
	type: string
	roomName: string
	payload: {
		msg: string
	}
}

export const wsStart = () => {
	const wss = new WebSocketServer({ port: 3001 })
	console.log("Server listening on :3001")

	let id: number = 0

	wss.on("connection", function connection(ws: any) {
		id++
		ws.id = id

		console.log("id - " + ws.id)

		ws.on("open", () => {
			console.log("Connection opened")
		})

		ws.on("message", (dataString: any) => {
			try {
				let jsonObj = JSON.parse(dataString)

				ws.send(JSON.stringify(ws))

				console.log(jsonObj)

				console.log("Success - msg sent to room!")
			} catch (error) {
				console.error(error)
			}
		})

		ws.on("close", () => {
			console.log("Connection closed - Client " + ws.id)

			// rooms2.removeClientFromAllRooms(ws)

			// console.log(rooms2.getRoom("room1").clients.length + " clients in room 1")
			// console.log(`Client ${ws.id} removed from all rooms`)
		})
	})
}
