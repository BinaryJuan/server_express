const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

// Logout
const logoutController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const username = req.session.username
        await DAO.cart.deleteCartByID(req.session.cartID)
        req.session.destroy(err => {
            if (!err) {
                res.render('logout.ejs', {username})
            } else res.send({error: 'logout', body: err})
        })
    }
}

module.exports = {logoutController}