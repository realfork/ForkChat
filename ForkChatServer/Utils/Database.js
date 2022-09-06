import { JsonDB, Config } from "node-json-db"

class Database {
    constructor() {
        this.db = new JsonDB(new Config("Data/users", true, true, "/"))
    }

    async add(key, json) {
        await this.db.push(`/${key}`, json)
    }

    async get(key) {
        return await this.db.getData(`/${key}`)
    }

    async has(key) {
        try {
            await this.db.getData(`/${key}`)
            return true
        } catch (e) { return false }
    }
}

export default new Database()