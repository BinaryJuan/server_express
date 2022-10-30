const ContenedorMongo = require('../../contenedores/contenedorMongo')
const MessageModel = require('../../model/message.model')

class MessageMongoDAO extends ContenedorMongo {
    
    constructor() {
        super(MessageModel)
    }

}

module.exports = MessageMongoDAO