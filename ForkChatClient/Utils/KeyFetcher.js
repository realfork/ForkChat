import * as openpgp from "openpgp"
import fetch from "node-fetch"

const keyRegex = /-----BEGIN PGP PUBLIC KEY BLOCK-----(.*)-----END PGP PUBLIC KEY BLOCK-----/s

export async function getKey(username) {
    const response = await (await fetch(`http://localhost:4201/key?username=${username}`)).text()

    const keyBody = response.match(keyRegex)?.[1]?.replaceAll(" ", "").split("").map((char, index) => index % 60 == 0 ? char + "\n" : char).join("").replace("=", "\n=")

    const formattedKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n${keyBody}\n-----END PGP PUBLIC KEY BLOCK-----`

    console.log("key: " + formattedKey)

    try { return await openpgp.readKey({ armoredKey: formattedKey })
    } catch (e) {
        console.log("Key Fetch Error!")
        return null
    }
}