class containerMessages {

    constructor(options, tableName) {
        const knexSqlite = require('knex')(options)
        this.options = options
        this.tableName = tableName
        this.knexSqlite = knexSqlite
        this.data = this.readMessages('*')
        knexSqlite.schema.createTable('messages', table => {
            table.string('user')
            table.string('message')
            table.integer('hour')
        })
        .then(() => {console.log('Messages table created')})
        .catch(() => {console.log('Messages table already exists!')})
    }

    readMessages(fieldsArray) {
        this.knexSqlite.from(this.tableName).select(fieldsArray)
        .then(messages => {
            messages ? this.data = messages : this.data = [{user: 'Bot', message: 'Welcome to the live chat!', hour: ''}]
        })
        .catch(error => console.log(error))
    }

    writeMessage(message) {
        return this.knexSqlite(this.tableName).insert(message)
    }

}

module.exports = containerMessages