const { Router } = require('express')
const login = Router()
const {postLogInController, renderLoggedInController} = require('../controllers/login.controller')

// Index logged in - POST
login.post('/', postLogInController)
// Index logged in - GET
login.get('/', renderLoggedInController)

module.exports = login