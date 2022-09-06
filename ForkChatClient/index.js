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
const encryption = new Encryption(publicKey, privateKey)
const socket = new Socket(username, password, encryption)

async function sendMessage(user, message) {
    const key = await getKey(username)
    if (!key) return

    socket.sendMessage(user, message, key)
}

setTimeout(async () => await sendMessage("fork", "hi"), 1000)