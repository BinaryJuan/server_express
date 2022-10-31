const { Router } = require('express')
const message = Router()
const {getAllMessages} = require('../controllers/message.controller')

// Get user messages - GET
message.get('/:email', getAllMessages)

module.exports = message