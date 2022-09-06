import prompt from "prompt"
prompt.start({ message: "\x1b[34mForkChat" })

const settings = [
    {
        name: "recipient",
        description: "Recipient",
        validator: /^[a-zA-Z0-9_]+$/,
        warning: "Username most only contain letters, numbers and underscores!",
        required: true
    },
    {
        name: "message",
        description: "Message",
        required: true
    }
]

export async function promptMessages() {
    return prompt.get(settings)    
}