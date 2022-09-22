const mongoose = require('mongoose')

const userSchema = {
    username: String,
    password: String,
    email: String,
    fname: String,
    address: String,
    age: Number,
    phone: Number,
    userImage: String,
    role: String
}
const userModel = mongoose.model('User', userSchema, 'users')

module.export = userModel