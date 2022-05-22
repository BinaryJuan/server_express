// ___Imports___
const express = require('express')
const Contenedor = require('./archivos')
const products = new Contenedor('products.txt')

// ___Functions___
const getMinId = () => {
    let minId = 999999
    products.data.forEach(product => {
        product.id < minId ? minId = product.id : null
    })
    return minId
}

const getMaxId = () => {
    let maxId = -999999
    products.data.forEach(product => {
        product.id > maxId ? maxId = product.id : null
    })
    return maxId
}

const randomRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomProduct = () => {
    let id = randomRange(getMinId(), getMaxId())
    return products.getById(id)
}

// ===== SERVER =====
const app = express()

app.get('/', (request, response) => {
    response.send('<h2>Welcome to my server. Routes:</h2> <ul><li>"/products"</li><li>"/randomProduct"</li></ul>')
})

app.get('/products', (request, response) => {
    response.send(products.data)
})

app.get('/randomProduct', (request, response) => {
    randomProduct()
    .then((prod) => {
        response.send(prod)
    })
})

const server = app.listen(process.env.PORT || 8080)
server.on('error', error => console.log(`Error found: ${error}`))