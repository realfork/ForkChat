import WebSocket from "ws"

export default class Socket {
    constructor(username, password) {
        // Change URL
        this.client = new WebSocket("ws://localhost:4200/")

        //this.client.on("open", () => this.client.send("<Login> " + JSON.stringify({ username, password })))
        this.client.on("open", () => this.client.send(JSON.stringify({ type: "login", username, password })))

        this.client.on("message", (message) => {
            const parsedMessage = JSON.parse(message)

            switch (parsedMessage.type) {
                case "message":
                    const encryptedMessage = parsedMessage.message

                    

                    console.log("Received message! " + encryptedMessage)
                    break
                case "status":
                    console.log("Status: " + parsedMessage.status)
                    break    
                case "error":
                    console.log("An error occured: " + parsedMessage.error)
                    process.exit()
            }
        })

        this.client.on("close", () => console.log("Connection closed."))
    }

    sendMessage(user, message) {
        this.client.send(JSON.stringify({ type: "message", recipient: user, message }))
    }

    async isConnecting() {
        while (this.client.CONNECTING) {}
        return false
    }
}