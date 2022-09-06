import fetch from "node-fetch"
import prompt from "prompt"
prompt.start({ message: "\x1b[34mForkChat" })

const settings = [
    {
        name: "username",
        description: "Username",
        validator: /^[a-zA-Z0-9_]+$/,
        warning: "Username most only contain letters, numbers and underscores!",
        required: true
    },
    {
        name: "password",
        description: "Password",
        hidden: true,
        required: true
    }
]

export async function getDetails() {
    return prompt.get(settings)
}

export async function login(username, password, publicKey) {
    // Change URL
    const response = await (await fetch(`http://localhost:4201/login?username=${username}&password=${password}&publicKey=${publicKey}`)).json()

    if (response.error) {
        console.log("Login Error: " + response.error)
        return false
    }

    console.log("Successfuly logged in!")
    return true
}