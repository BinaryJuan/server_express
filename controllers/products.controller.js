const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

// Products list
const getAllProductsController = async (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            const products = await DAO.product.getAll()
            const sessionUsername = req.session.userObject
            res.render('products.ejs', {products, sessionUsername})
        }
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// Add body product
const addProductController = async (req, res) => {
    try {
        const user = req.session.userObject
        if (user.role == 'admin') {
            await DAO.product.save(req.body)
            res.redirect('/')
        } else {
            res.send('Error, forbidden access (you are not an admin)')
        }
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// Product detail
const showProductDetailController = async (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            const id = req.params.id
            await DAO.product.getByID(id).then((data) => {
                if (data !== undefined && data.length) {
                    const objProduct = data[0]
                    res.render('productDetail.ejs', {objProduct})
                } else {
                    res.render('notfound.ejs')
                }
            })
        }
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// Delete product by ID
const deleteProductByIdController = async (req, res) => {
    try {
        const user = req.session.userObject
        if (user.role == 'admin') {
            const id = req.params.id
            await DAO.product.deleteByID(id)
            res.send(`Product with ID #${id} deleted.`)
        } else {
            res.send('Error, forbidden access (you are not an admin)')
        }
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// Edit product form
const editProductByIdFormController = async (req, res) => {
    try {
        const user = req.session.userObject
        if (user.role == 'admin') {
            const id = req.params.id
            const username = req.session.username
            DAO.product.getByID(id).then((data) => {
                console.log(data)
                if (data !== undefined && data.length) {
                    const prod = data[0]
                    res.render('edit.ejs', {username, prod})
                } else {
                    res.render('notfound.ejs')
                }
            })
        } else {
            res.send('Error, forbidden access (you are not an admin)')
        }
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

// Edit product by ID
const editProductByIdController = async (req, res) => {
    try {
        const user = req.session.userObject
        if (user.role == 'admin') {
            const id = req.params.id
            await DAO.product.editById(req.body, id)
            const products = await DAO.product.getAll()
            const sessionUsername = req.session.userObject
            res.render('products.ejs', {products, sessionUsername})
        } else {
            res.send('Error, forbidden access (you are not an admin)')
        }
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

module.exports = {getAllProductsController, addProductController, showProductDetailController, 
    deleteProductByIdController, editProductByIdFormController, editProductByIdController}