class containerProducts {

    constructor(options, tableName) {
        const knex =  require('knex')(options)
        this.options = options
        this.tableName = tableName
        this.knex = knex
        this.data = this.selectProduct('*')
        knex.schema.createTable(tableName, table => {
            table.increments('id')
            table.string('title')
            table.integer('price')
            table.string('description')
            table.integer('stock')
            table.integer('timestamp')
            table.string('img')
        })
        .then(() => console.log("Table products created"))
        .catch(() => {console.log('Table products already exists!')})
    }

    selectProduct(fieldsArray) {
        this.knex.from(this.tableName).select(fieldsArray)
        .then(prods => {
            prods ? this.data = prods : this.data = []
        })
        .catch(error => console.log(error))
    }

    selectProductById(field, condition, value) {
        return this.knex.from(this.tableName).select(['id', 'title', 'price', 'description', 'stock', 'timestamp', 'img']).where(field, condition, value)
    }

    insertProduct(products) {
        return this.knex(this.tableName).insert(products)
    }

    editProductById(id, condition, value, field, newValue) {
        let objectProduct = {}
        objectProduct[field] = newValue
        this.knex.from(this.tableName)
        .where(id, condition, value)
        .update(objectProduct)
        .then(() => this.selectProduct('*'))
        .catch(error => console.log(error))
    }

    deleteProductById(field, condition, value) {
        this.knex.from(this.tableName)
        .where(field, condition, value)
        .del()
        .then(() => this.selectProduct('*'))
        .catch(error => console.log(error))
    }
}

module.exports = containerProducts