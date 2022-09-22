const { Router } = require('express')
const register = Router()
const {renderRegisterPageController, postRegisterController} = require('../controllers/register.controller')

// Register an account - GET
register.get('/', renderRegisterPageController)
// Register successful - POST
register.post('/', postRegisterController)

module.exports = register