const FactoryDAO = require('../daos/index')
const bcrypt = require('bcrypt')
const DAO = FactoryDAO()
const userModel = require('../model/user.model')

// Index login in
const postLogInController = async (req, res) => {
    const { email, password } = req.body
    let sessionUsername
    userModel.findOne({email: email}, async (error, foundItem) => {
        if (error) {
            res.send(error)
        } else {
            if (foundItem) {
                const compare = await bcrypt.compare(password, foundItem.password)
                req.session.username = foundItem.username
                req.session.userObject = foundItem
                sessionUsername = foundItem.username
                if (compare) {
                    const products = await DAO.product.getAll()
                    const { id } = await DAO.cart.cartSave()
                    req.session.cartID = id
                    console.log(req.session.cartID)
                    res.render('form.ejs', {products, sessionUsername})
                } else {
                    res.render('error-auth.ejs', {error: 'Incorrect password'})
                }
            } else {
                res.render('error-auth.ejs', {error: 'Account not found'})
            }
        }
    })
}

// Index logged in
const renderLoggedInController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const products = await DAO.product.getAll()
        const sessionUsername = req.session.username
        res.render('form.ejs', {products, sessionUsername})
    }
}

module.exports = {postLogInController, renderLoggedInController}