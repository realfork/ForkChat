import * as openpgp from "openpgp"

export default class Encryption {
    constructor(publicKey, privateKey) {
        this.publicKey = publicKey
        this.privateKey = privateKey
    }

    async encryptMessage(message, publicKey) {
        return await openpgp.encrypt({ 
            message: await openpgp.createMessage({ text: message }),
            encryptionKeys: publicKey,
            signingKeys: this.privateKey
        })
    }
    
    // ADD SENDER VERIFICATION
    async decryptMessage(encryptedMessage) { // , publicKey
        const { data: decrypted, signatures } = await openpgp.decrypt({
            message: await openpgp.readMessage({ armoredMessage: encryptedMessage }),
            //verificationKeys: publicKey,
            decryptionKeys: this.privateKey
        })
        return decrypted
    
        //if (!verifySignature(signatures)) return null
        //else return decrypted
    }
    
    async verifySignature(signature) {
        try {
            await signature[0].verified
            return true
        } catch (e) { return false }
    }
}