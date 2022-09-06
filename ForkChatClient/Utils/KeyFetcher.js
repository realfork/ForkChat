import * as openpgp from "openpgp"
import fetch from "node-fetch"

const keyRegex = /-----BEGIN PGP PUBLIC KEY BLOCK-----(.*)-----END PGP PUBLIC KEY BLOCK-----/s

export async function getKey(username) {
    const response = await (await fetch(`http://localhost:4201/key?username=${username}`)).text()

    try { return await openpgp.readKey({ armoredKey: Buffer.from(response, "base64").toString("ascii") })
    } catch (e) {
        console.log("Key Fetch Error!")
        return null
    }
}