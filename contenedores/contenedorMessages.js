const fs = require('fs')

class ContenedorFile {

    constructor(textJson) {
        this.textJson = textJson;
        this.data = []
        try {
            this.read()
        } catch (error) {
            this.write()
        }
    }

    read() {
        this.data = JSON.parse(fs.readFileSync(this.textJson));
    }

    write() {
        fs.writeFileSync(this.textJson, JSON.stringify(this.data));
    }

    writeMessage(msg) {
        this.data.push(msg)
        return fs.promises.writeFile(this.textJson, JSON.stringify(this.data))
    }
    
    async getAll() {
        return this.data
    }

    async deleteAll() {
        this.data = []
        this.write()
    }
}

module.exports = ContenedorFile;