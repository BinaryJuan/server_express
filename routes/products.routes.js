const { Router } = require('express')
const products = Router()
const {getAllProductsController, addProductController, showProductDetailController, deleteProductByIdController, editProductByIdFormController, editProductByIdController} = require('../controllers/products.controller')

// Products list - GET
products.get('/', getAllProductsController)
// Add body product - POST
products.post('/', addProductController)
// Product detail - GET
products.get('/:id', showProductDetailController)
// Delete product by ID - DELETE
products.delete('/:id', deleteProductByIdController)
// Edit product form - GET
products.get('/edit/:id', editProductByIdFormController)
// Edit product by ID - PUT
products.put('/:id', editProductByIdController)

module.exports = products