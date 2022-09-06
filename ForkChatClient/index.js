import * as openpgp from "openpgp"

import { getDetails, login } from "./Utils/Login.js"
import { getKey } from "./Utils/KeyFetcher.js"
import Socket from "./Utils/Socket.js"
import Encryption from "./Utils/Encryption.js"

// Get Login inputs
const { username, password } = await getDetails()

// Generate keys
const keyPair = await openpgp.generateKey({ 
    type: "rsa",
    rsaBits: 4096,
    userIDs: [{ name: username }],
    passphrase: password
})
const publicKey = await openpgp.readKey({ armoredKey: keyPair.publicKey })
const privateKey = await openpgp.decryptKey({ privateKey: await openpgp.readPrivateKey({ armoredKey: keyPair.privateKey }), passphrase: password })
console.log("Successfully generated public and private keys!")

// Log into server
if (!await login(username, password, keyPair.publicKey)) process.exit()

// Create helper classes
const socket = new Socket(username, password)
const encryption = new Encryption(publicKey, privateKey)

async function sendMessage(user, message) {
    console.log(keyPair.publicKey)

    const key = await getKey(username)
    if (!key) return

    const encryptedMessage = encryption.encryptMessage(message, key)
    socket.sendMessage(user, encryptedMessage)
}

sendMessage("fork", "hi")