const ContenedorMongo = require('../../contenedores/contenedorMongo')
const OrderModel = require('../../model/order.model')

class OrderMongoDAO extends ContenedorMongo {
    
    constructor() {
        super(OrderModel)
    }

}

module.exports = OrderMongoDAO