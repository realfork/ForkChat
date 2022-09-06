import Database from "./Utils/Database.js"

// Websocket
import WebSocket from "ws"

const server = new WebSocket.Server({ port: 4200 })
const clients = new Map()

server.on("connection", async (client, request) => {
    // Message Handler
    client.on("message", async (message) => {
        const parsedMessage = JSON.parse(message)

        if (!parsedMessage.type) return client.send(JSON.stringify({ type: "error", error: "Missing type arguments!" }))

        switch (parsedMessage.type) {
            case "login":
                let { username, password } = parsedMessage
                if (!username || !password || !await Database.has(username)) return client.send(JSON.stringify({ type: "error", error: "Invalid username or password!" }))

                if ((await Database.get(username)).hashedPassword != crypto.createHash("sha256").update(password).digest("hex")) 
                    return client.send(JSON.stringify({ type: "error", error: "Invalid username or password!" }))

                clients.set(username, client)
                break
            case "message":
                const { recipient, message } = parsedMessage

                if (clients.has(recipient)) {
                    clients.get(recipient).send(JSON.stringify({ type: "message", message }))

                    client.send(JSON.stringify({ type: "status", status: `Message sent to ${recipient}!` }))
                } 
                // ADD MESSAGE CACHING FOR WHEN OFFLINE
                else client.send(JSON.stringify({ type: "status", status: "Invalid user! Message failed to send!" }))
                break    
        }
    })

    client.on("close", () => clients.delete(client))
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

    let hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    // Register 
    if (!await Database.has(username)) await Database.add(username, { hashedPassword, publicKey })
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
    if (!await Database.has(username)) return response.json({ error: "Invalid user!" })
   
    let data = await Database.get(username)
    response.send(data.publicKey)
})
web.listen(4201, () => console.log("Server started!"))
//https.createServer({
//    key: fs.readFileSync('./ssl/key.key'),
//    cert: fs.readFileSync('./ssl/certificate.pem')
//}, web).listen(2082);