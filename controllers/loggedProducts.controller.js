const bcrypt = require('bcrypt')
const userModel = require('../model/user.model')
const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

// Index log in 
const postLogInController = async (req, res) => {
    try {
        const { email, password } = req.body
        let sessionUsername
        userModel.findOne({email: email}, async (error, foundItem) => {
            if (error) {
                res.send(error)
            } else {
                if (foundItem) {
                    const compare = await bcrypt.compare(password, foundItem.password)
                    if (compare) {
                        req.session.username = foundItem.username
                        req.session.userObject = foundItem
                        sessionUsername = foundItem
                        const products = await DAO.product.getAll()
                        const { id } = await DAO.cart.cartSave()
                        req.session.cartID = id
                        res.render('products.ejs', {products, sessionUsername})
                    } else {
                        res.render('error-auth.ejs', {error: 'Incorrect password'})
                    }
                } else {
                    res.render('error-auth.ejs', {error: 'Account not found'})
                }
            }
        })
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// Index logged in
const renderLoggedInController = async (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            const sessionUsername = req.session.userObject
            if (sessionUsername.role == 'admin') {
                const products = await DAO.product.getAll()
                res.render('form.ejs', {products, sessionUsername})
            } else {
                res.send('Error, forbidden route (you are not an admin)')
            }
        }
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

module.exports = {postLogInController, renderLoggedInController}