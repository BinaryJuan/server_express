const { Router } = require('express')
const carts = Router()
const {getAllCartsController, addToCartController, deleteCartController, deleteAllCartsController} = require('../controllers/carts.controller')

// Get all carts - GET
carts.get('/', getAllCartsController)
// Add to cart - POST
carts.post('/', addToCartController)
// Delete a product in cart - DELETE
carts.delete('/:id', deleteCartController)
// Delete cart - DELETE
carts.delete('/', deleteAllCartsController)

module.exports = carts