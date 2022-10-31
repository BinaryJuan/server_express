const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()
const nodemailer = require('nodemailer')
const emailNotification = process.env.EMAIL

// Get all carts
const getAllCartsController = async (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            const cart = await DAO.cart.getAll()
            const userCart = cart[0] ? cart[0].products : undefined
            const user = req.session.userObject
            res.render('carts.ejs', {userCart, user})
        }
    } catch(err) {
        res.render('error.ejs', {err})
    }
}

// Add to cart
const addToCartController = async (req, res) => {
    try {
        const { addID } = req.body
        let productToAdd = await DAO.product.getByID(addID)
        if (productToAdd.length > 0) {
            res.send(await DAO.cart.insertProductInCart(productToAdd, req.session.cartID))
        } else {
            res.send({error: 'The product does not belong to our inventory.'})
        }
    } catch(err) {
        res.render('error.ejs', {err})
    }
}

// Delete a product in cart - DELETE
const deleteCartController = async (req, res) => {
    try {
        const prodId = req.params.id
        await DAO.cart.deleteProductInCart(req.session.cartID, prodId)
        res.send(`Product with ID #${prodId} deleted from cart.`)
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// Delete cart - DELETE
const deleteAllCartsController = async (req, res) => {
    try {
        await DAO.cart.deleteAll()
        res.send('All cart products deleted.')
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// --- Function: send order
const sendOrder = async (req, res) => {
    try {
        const cart = await DAO.cart.getAll()
        const titles = req.body.map(obj => {
            return obj.title
        }).join(', ')
        const accountSid = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN
        const client = require('twilio')(accountSid, authToken)
        client.messages
            .create({
                from: '+12342043900',
                body: `Compraste: ${titles}`,
                to: process.env.PHONE_NUMBER
            })
            .then(() => {
                DAO.order.orderSave(cart)
                .then((order) => {
                    const transporter = nodemailer.createTransport ({
                        host: "smtp.gmail.com",
                        port: 465,
                        auth: {
                            user: emailNotification,
                            pass: 'bmhefmnvcnbcfdgh'
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    })
                    const purchased = order[0].map(prod => {
                        return prod.title
                    }).join(', ')
                    transporter.sendMail({
                        from: emailNotification,
                        to: [emailNotification],
                        subject: 'New order generated',
                        html:
                            `
                                <h2>Order created by: ${req.session.username}</h2>
                                <p>Purchased products: ${purchased}</p>
                            `
                    })
                    .then(res => console.log(res))
                    .catch(err => console.log(err))
                    DAO.cart.deleteAllProductsInCart(req.session.cartID)
                    res.send('Order sent!')
                })
            })
            .catch(err => {
                console.log(err)
            })
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// --- Function: delete all products from current cart
const deleteCartAll = async (req, res) => {
    try {
        DAO.cart.deleteAllProductsInCart(req.session.cartID)
        res.send('Cart is now empty')
    } catch (err) {
        console.log(err)
    } 
}

module.exports = {getAllCartsController, addToCartController, deleteCartController, deleteAllCartsController, sendOrder, deleteCartAll}