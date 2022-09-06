import WebSocket from "ws"

export default class Socket {
    constructor(username, password) {
        // Change URL
        this.client = new WebSocket("ws://localhost:4200/")

        this.client.on("open", () => this.client.send("<Login> " + JSON.stringify({ username, password })))

        this.client.on("message", (message) => {
            let string = message.toString()
            let formattedMessage = string.split(" ")
            
            let command = formattedMessage[0].replaceAll(/[<>]/g, "")

            switch (command) {
                case "Message":
                    break
                case "Status":
                    console.log("Status: " + string.substring(string.indexOf(formattedMessage[1])))
                    break    
                case "Error":
                    console.log("An error occured: " + string.substring(string.indexOf(formattedMessage[1])))
                    process.exit()
            }
        })

        this.client.on("close", () => console.log("Connection closed."))
    }

    sendMessage(user, message) {
        this.client.send(`<Message> ${user}:${message}`)
    }
}