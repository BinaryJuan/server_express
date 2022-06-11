//  === BACKEND ===  //
// ___Imports___
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const Contenedor = require('./public/files')
const products = new Contenedor('./public/products.txt')

// ___SERVER___
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

// --- Previous messages
const messages = [
    {user: 'Bot', message: 'Welcome to the live chat!', hour: ''}
]

// ------ Data traffic ------
io.on('connection', socket => {
    // --- User ID
    console.log(`New user connected with ID '${socket.id}'`)
    // --- Product management
    socket.emit('products', products.data)
    socket.on('newProduct', prod => {
        let { title, price, img } = prod
        price = Number(price)
        products.save({title, price, img})
        .then(() => {
            io.sockets.emit('products', products.data)
        })
    })
    // --- Message management
    socket.emit('messages', messages)
    socket.on('newMessage', msg => {
        messages.push(msg)
        io.sockets.emit('messages', messages)
    })
})

// ------ Routes ------
app.get('/', (req, res) => {
    res.render('form.ejs', {products})
})

// ------- Initializing server -------
httpServer.listen(process.env.PORT || 8080)
httpServer.on('error', error => console.log(`Error found: ${error}`))