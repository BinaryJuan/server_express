const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

// Get all carts
const getAllCartsController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const cart = await DAO.cart.getAll()
        const userCart = cart[0].products
        const username = req.session.username
        res.render('carts.ejs', {userCart, username})
    }
}

// Add to cart
const addToCartController = async (req, res) => {
    const { addID } = req.body
    let productToAdd = await DAO.product.getByID(addID)
    if (productToAdd.length > 0) {
        res.send(await DAO.cart.insertProductInCart(productToAdd))
    } else {
        res.send({error: 'The product does not belong to our inventory.'})
    }
}

// Delete a product in cart - DELETE
const deleteCartController = async (req, res) => {
    const id = req.params.id
    await DAO.cart.deleteByID(id)
    res.send(`Product with ID #${id} deleted from cart.`)
}

// Delete cart - DELETE
const deleteAllCartsController = async (req, res) => {
    await DAO.cart.deleteAll()
    res.send('All cart products deleted.')
}

module.exports = {getAllCartsController, addToCartController, deleteCartController, deleteAllCartsController}