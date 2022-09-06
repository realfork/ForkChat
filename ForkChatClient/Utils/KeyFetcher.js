import fetch from "node-fetch"

export async function getKey(username) {
    const response = await (await fetch(`http://localhost:4201/key?username=${username}`)).json()

    if (response.key) return response.key
    else {
        console.log("Key Fetch Error: " + response.error)
        return null
    }
}