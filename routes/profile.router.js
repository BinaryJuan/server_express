const { Router } = require('express')
const profile = Router()
const {getProfileController} = require('../controllers/profile.controller')

// Profile - GET
profile.get('/profile', getProfileController)

module.exports = profile