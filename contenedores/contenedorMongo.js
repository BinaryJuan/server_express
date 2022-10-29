const ObjectId = require('mongoose').Types.ObjectId

class ContenedorMongo {

    constructor(model) {
        this.model = model
        this.userCart = 'empty'
    }

    async save(obj) {
        const newProduct = new this.model(obj)
        await newProduct.save()
        return newProduct
    }

    async cartSave() {
        const newCart = new this.model()
        this.userCart = newCart
        await newCart.save()
        return newCart
    }

    async insertProductInCart(obj) {
        this.userCart.products.push(obj[0])
        this.userCart.save()
    }

    async deleteCartByID(id) {
        await this.model.deleteOne({_id: id})
    }

    async getByID(id) {
        try {
            return await this.model.find({_id: id})
        } catch (err) {
            console.log('No existe éste producto.')
        }
    }

    async getAll() {
        return await this.model.find({})
    }

    async editById(obj, id) {
        const objUpdated = await this.model.updateOne(
            { _id: new ObjectId(id)},
            { $set: obj }
        )
        return objUpdated
    }

    async deleteByID(id) {
        const userDelete = await this.model.deleteOne({_id: new ObjectId(id)})
        return true
    }


}

module.exports = ContenedorMongo;
