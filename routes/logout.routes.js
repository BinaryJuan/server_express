const { Router } = require('express')
const logout = Router()
const {logoutController} = require('../controllers/logout.controller')

// Logout
logout.get('/', logoutController)

module.exports = logout