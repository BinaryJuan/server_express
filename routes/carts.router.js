const { Router } = require('express')
const carts = Router()
const {getAllCartsController, addToCartController, deleteCartController, deleteAllCartsController, sendOrder, deleteCartAll} = require('../controllers/carts.controller')

// Get all carts - GET
carts.get('/', getAllCartsController)
// Add to cart - POST
carts.post('/', addToCartController)
// Send order to whatsapp
carts.post('/purchase', sendOrder)
// Delete all products from cart
carts.delete('/deleteAll', deleteCartAll)
// Delete a product in cart - DELETE
carts.delete('/:id', deleteCartController)
// Delete cart - DELETE
carts.delete('/', deleteAllCartsController)

module.exports = carts