const express = require('express')
require('./config')
const bodyParser = require('body-parser')
const http = require('http')
const { Server } = require('socket.io')
const FactoryDAO = require('./daos/index')
const contenedorMessages = require('./contenedores/contenedorMessages')
const messages = new contenedorMessages('DB_messages.json')
const { normalize, schema } = require('normalizr')

// ======== SERVER ========
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

// --- Server config. ---
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('views', './views')
app.set('view engine', 'ejs')
const DAO = FactoryDAO()

//
const user = new schema.Entity('users')
const message = new schema.Entity('messages', {
    messenger: user
})
const messageSchema = new schema.Entity('message', {
    author: user,
    messages: [message]
})

// --- Routes ---
app.get('/', (req, res) => res.send('Bienvenido'))  // Inicio
app.get('/products', async (req, res) => {  // Lista de productos
    const products = await DAO.product.getAll()
    res.render('products.ejs', {products})
})
app.get('/products/:id', async (req, res) => {  // Detalles del producto
    const id = req.params.id
    const objProduct = await DAO.product.getByID(id)
    console.log(objProduct)
    res.render('productDetail.ejs', {objProduct})
})

app.post('/products', async (req, res) => res.send(await DAO.product.save(req.body))) // 

app.get('/cart', async (req, res) => res.send(await DAO.cart.getAll()))
app.post('/cart', async (req, res) => res.send(await DAO.cart.save(req.body)))

// === MESSAGES
io.on('connection', socket => {
    // --- User ID
    console.log(`New user connected with ID '${socket.id}'`)
    messages.read()
    const normalizedData = normalize(messages.data, [messageSchema])
    // --- Message management
    socket.emit('messages', normalizedData)
    socket.on('newMessage', async (msg) => {
        await messages.writeMessage(msg)
        messages.read()
        const normalizedData = normalize(messages.data, [messageSchema])
        io.sockets.emit('messages', normalizedData)
    })
})

// ------- Initilize server -------
httpServer.listen(process.env.PORT || 8080)
httpServer.on('error', error => console.log(`Error found: ${error}`))