const { Router } = require('express')
const productForm = Router()
const {postLogInController, renderLoggedInController} = require('../controllers/loggedProducts.controller')

// POST - loggedin product-form
productForm.post('/', postLogInController)
productForm.get('/', renderLoggedInController)

module.exports = productForm