import WebSocket from "ws"

export default class Socket {
    constructor(username, password, encryption) {
        this.encryption = encryption

        // Change URL
        this.client = new WebSocket("ws://localhost:4200/")

        //this.client.on("open", () => this.client.send("<Login> " + JSON.stringify({ username, password })))
        this.client.on("open", () => this.client.send(JSON.stringify({ type: "login", username, password })))

        this.client.on("message", async (message) => {
            const parsedMessage = JSON.parse(message)

            switch (parsedMessage.type) {
                case "message":
                    const decryptedMessage = await this.encryption.decryptMessage(parsedMessage.message)

                    console.log(`${parsedMessage.sender} > ${decryptedMessage}`)
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

    async sendMessage(user, message, key) {
        const encryptedMessage = await this.encryption.encryptMessage(message, key)

        this.client.send(JSON.stringify({ type: "message", recipient: user, message: encryptedMessage }))
    }
}