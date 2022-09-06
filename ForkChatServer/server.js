import Database from "./Utils/Database.js"

// Websocket
import WebSocket from "ws"

const server = new WebSocket.Server({ port: 4200 })
const clients = new Map()

server.on("connection", async (client, request) => {
    // Message Handler
    client.on("message", async (message) => {
        let formattedMessage = message.split(" ")
        let command = formattedMessage[0].replaceAll(/[<>]/g, "")

        switch (command) {
            case "Login":
                let { username, password } = JSON.parse(formattedMessage[1])
                if (!username || !password || !Database.has(username)) return client.send("<Error> Invalid username or password!")

                if ((await Database.get(username)).hashedPassword != crypto.createHash("sha256").update(password).digest("hex")) 
                    return client.send("<Error> Invalid username or password!")

                clients.set(username, client)
                client.send("<Status> Logged into socket!")
                break
            case "Message":
                let messageString = message.substring(message.indexOf(formattedMessage[1]))

                let recipient = message.split(":")[0]
                let returnMessage = messageString.substring(messageString.indexOf(recipient))

                if (clients.has(recipient)) clients.get(recipient).send("<Message> " + returnMessage)
                else client.send("<Status> Invalid user! Message failed to send!")
                break    
        }
    })

    client.on("close", () => clients.delete(request.socket.remoteAddress))
})

// Web server
import express from "express"
import crypto from "crypto"

const web = express()
web.set('trust proxy', true)

// Login
web.get("/login", async (request, response) => {
    let { username, password, publicKey } = request.query
    if (!username || !password || !publicKey) return response.json({ error: "Missing arguments!" })

    // Register 
    if (!Database.has(username)) await Database.add(username, { hashedPassword, publicKey })
   
    let hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    let data = await Database.get(username)

    if (data.hashedPassword == hashedPassword) {
        data.publicKey = publicKey

        await Database.add(username, data)

        return response.json({ status: "Successfully logged in!" })
    } else response.json({ error: "Incorrect password!" })
})

// Public Key Getter
web.get("/key", async (request, response) => {
    let { username } = request.query
    if (!username) return response.json({ error: "Missing arguments!" })

    // Check if user is valid
    if (!Database.has(username)) return response.json({ error: "Invalid user!" })
   
    let data = await Database.get(username)
    response.json({ key: data.publicKey })
})
web.listen(4201, () => console.log("Server started!"))
//https.createServer({
//    key: fs.readFileSync('./ssl/key.key'),
//    cert: fs.readFileSync('./ssl/certificate.pem')
//}, web).listen(2082);