// __Imports__
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { Router } = express
const bodyParser = require('body-parser')
const ContainerProducts = require('./public/containerKnex')
const options = require('./options/mariaDB')
const products = new ContainerProducts(options, 'products')
const ContainerMessages = require('./public/containerSqlite')
const optionsSqlite = require('./options/sqlite')
const messages = new ContainerMessages(optionsSqlite, 'messages')

// ======== SERVER ========
const app = express()
const routerProducts = Router()
const routerCart = Router()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

// --- Server config. ---
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('views', './views')
app.set('view engine', 'ejs')

// ======== S.ROUTES ========
// === PRODUCTS
// 1. Devuelve todos los productos
routerProducts.get('/', (request, response) => {
    products.selectProduct('*')
    response.render('products.ejs', {products})
})

// 2. Devuelve un producto según su ID
routerProducts.get('/:id', (request, response) => {
    const id = request.params.id
    products.selectProductById('id', '=', id)
    .then((objProduct) => {
        objProduct = objProduct[0]
        objProduct ? response.render('productDetail.ejs', {objProduct}) : response.json({error: 'Product not found.'})
    })
    .catch((error) => {console.log(error)})
})

// 3. Recibe y agrega un producto (websocket)
app.get('/', (request, response) => {
    const admin = 'true' // ----*
    if (admin == 'true') {
        products.selectProduct('*')
        response.render('form.ejs', {products})
    } else {
        const url = request.protocol + '://' + request.get('host') + request.originalUrl;
        response.json({error: -1, description: `URL "${url}" method not autorized.`})
    }
})

// 4. Recibe y actualiza un producto según su ID (POSTMAN)
routerProducts.put('/:id', (request, response) => {
    const admin = 'true' // ----*
    if (admin == 'true') {
        const { id } = request.params
        const field = Object.keys(request.body)[0]
        const value = Object.values(request.body)[0]
        products.editProductById('id', '=', id, field, value)
        response.json({message: `Product with ID #${id} edited.`})
    } else {
        const url = request.protocol + '://' + request.get('host') + request.originalUrl;
        response.json({error: -1, description: `URL "${url}" method not autorized.`})
    }
})

// 5. Elimina un producto según su ID (POSTMAN)
routerProducts.delete('/:id', (request, response) => {
    const admin = 'true' // ----*
    if (admin == 'true') {
        const id = Number(request.params.id)
        products.deleteProductById('id', '=', id)
        response.json({message: `Product with ID #${id} deleted.`})
    } else {
        const url = request.protocol + '://' + request.get('host') + request.originalUrl;
        response.json({error: -1, description: `URL "${url}" method not autorized.`})
    }
})

// === MESSAGES & ADD PRODUCTS
io.on('connection', socket => {
    // --- User ID
    console.log(`New user connected with ID '${socket.id}'`)
    // --- Message management
    socket.emit('messages', messages.data)
    socket.on('newMessage', msg => {
        messages.writeMessage([msg])
        .then(() => {
            messages.data.push(msg)
            io.sockets.emit('messages', messages.data)
        })
        .catch(error => console.log(error))
    })
    // --- Product management
    socket.emit('products', products.data)
    socket.on('newProduct', prod => {
        let { title, price, description, stock, img } = prod
        price = Number(price)
        stock = Number(stock)
        products.insertProduct([{title, price, description, stock, img, timestamp: Date.now()}])
        .then(() => {
            products.data.push({title, price, description, stock, img, timestamp: Date.now()})
            io.sockets.emit('products', products.data)
        })
        .catch(error => console.log(error))
    })
})

// ======== S.INITIALIZE ========
// --- Router config. ---
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCart)
app.use((request, response) => {
    const url = request.protocol + '://' + request.get('host') + request.originalUrl;
    response.json({error: -2, description: `URL "${url}" method not implemented`})
})

// ------- Initilize server -------
httpServer.listen(process.env.PORT || 8080)
httpServer.on('error', error => console.log(`Error found: ${error}`))