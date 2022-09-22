const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

// Products list
const getAllProductsController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const products = await DAO.product.getAll()
        const username = req.session.username
        res.render('products.ejs', {products, username})
    }
}

// Add body product
const addProductController = async (req, res) => {
    await DAO.product.save(req.body)
    const products = await DAO.product.getAll()
    const username = req.session.username
    res.render('products.ejs', {products, username})
}

// Product detail
const showProductDetailController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const id = req.params.id
        let objProduct = await DAO.product.getByID(id)
        objProduct = objProduct[0]
        res.render('productDetail.ejs', {objProduct})
    }
}

// Delete product by ID
const deleteProductByIdController = async (req, res) => {
    const id = Number(req.params.id)
    await DAO.product.deleteByID(id)
    res.send(`Product with ID #${id} deleted.`)
}

// Edit product form
const editProductByIdFormController = async (req, res) => {
    const id = Number(req.params.id)
    const username = req.session.username
    const prod = await DAO.product.getByID(id)
    res.render('edit.ejs', {username, prod})
}

// Edit product by ID
const editProductByIdController = async (req, res) => {
    const id = Number(req.params.id)
    await DAO.product.editById(req.body, id)
    const products = await DAO.product.getAll()
    const username = req.session.username
    res.render('products.ejs', {products, username})
}

module.exports = {getAllProductsController, addProductController, showProductDetailController, 
    deleteProductByIdController, editProductByIdFormController, editProductByIdController}