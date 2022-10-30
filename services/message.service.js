const MessageModel = require('../model/message.model');
const BaseDao = require("./BaseDao.js")

class MessageService extends BaseDao {

    ID_FIELD = "_id";

    static getInstance() {
        return new MessageService();
    }

    constructor() {
        if(typeof MessageService.instance === 'object') {
            return MessageService.instance;
        }
        super();
        MessageService.instance = this;
        return this;
    }

    async create() {
        try {
            return await MessageModel.create({});
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

}

module.exports = MessageService