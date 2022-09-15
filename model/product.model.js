const mongoose = require('mongoose');

const ProductModel = mongoose.model(
    'Products', 
    new mongoose.Schema({
        title: String,
        price: Number,
        stock: Number,
        img: String
    })
);

module.exports = ProductModel;