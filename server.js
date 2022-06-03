// ___Imports___
const express = require('express')
const Contenedor = require('./files')
const products = new Contenedor('products.txt')

// ___SERVER___
const app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// ------- Routes -------
app.get('/', (req, res) => {
    products.init()
    res.render('form.ejs', {products})
})

app.get('/products', (req, res) => {
    res.render('products.ejs', {products})
})

app.post('/products', async (req, res) => {
    let { title, price, img } = req.body
    price = Number(price)
    await products.save({title, price, img})
    products.init()
    res.render('products.ejs', {products})
})

// ------- Initializing server -------
const server = app.listen(process.env.PORT || 8080)
server.on('error', error => console.log(`Error found: ${error}`))