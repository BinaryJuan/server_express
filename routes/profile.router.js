const { Router } = require('express')
const profile = Router()
const {getProfileController} = require('../controllers/profile.controller')

// Profile - GET
profile.get('/', getProfileController)

module.exports = profile