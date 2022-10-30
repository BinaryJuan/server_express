const OrderModel = require('../model/order.model');
const BaseDao = require("./BaseDao.js")

class OrderService extends BaseDao {

    ID_FIELD = "_id";

    static getInstance() {
        return new OrderService();
    }

    constructor() {
        if(typeof OrderService.instance === 'object') {
            return OrderService.instance;
        }
        super();
        OrderService.instance = this;
        return this;
    }

    async create() {
        try {
            return await OrderModel.create({});
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

}

module.exports = OrderService