// IMPORT TECHS
const express = require('express')      
require('./config/config')
const bodyParser = require('body-parser')
const http = require('http')
const { Server } = require('socket.io')
const contenedorMessages = require('./contenedores/contenedorMessages')
const messages = new contenedorMessages('DB_messages.json')
const { normalize, schema } = require('normalizr')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const {graphqlHTTP} = require('express-graphql')
const schemaGraph =  require('./graphql/Schema.js')
const CarritoService = require("./services/carrito.service.js")
const ProductoService = require("./services/producto.service.js")
//const logger = require("./logger")

// ======== SERVER ========
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

// --- Server config. ---
app.use(express.static(__dirname + '/public'))
app.use(session({
    store: new mongoStore ({
        mongoUrl: 'mongodb+srv://admin:admin@desafioclase20.zbhpwfs.mongodb.net/sessions',
        mongoOptions: advancedOptions
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        expires: 600000
    }
}))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// --- Routes ---
const profile = require('./routes/profile.router')
const productForm = require('./routes/loggedProducts.router')
const carts = require('./routes/carts.router')
const products = require('./routes/products.routes')
const logout = require('./routes/logout.routes')
const register = require('./routes/register.routes')

app.use('/', productForm)
app.use('/products-form', productForm)
app.use('/profile', profile)
app.use('/carts', carts)
app.use('/products', products)
app.use('/logout', logout)
app.use('/register', register)
app.all("*", (req, res) => {
    res.render('notfound.ejs')
})

/*app.use((req, res, next) => {
    logger.info(`Ruta: ${req.path}, Método: ${req.method}`)
    next()
})
*/

async function getAllCarritos() {
    return CarritoService.getInstance().getAll();
}

async function getAllProductos() {
    return ProductoService.getInstance().getAll();
}

async function createCarrito() {
    return CarritoService.getInstance().create();
}

async function deleteCarritoById({ id }) {
    return CarritoService.getInstance().deleteById(id);
}

async function getAllProductsFromCartById({ id }) {
    return CarritoService.getInstance().getAllProductsFromCart(id);
}

async function saveProductToCart({ id, idProd }) {
    return CarritoService.getInstance().saveProductToCart(id, idProd);
}

async function deleteProductFromCart({ id, idProd }) {
    return CarritoService.getInstance().deleteProductFromCart(id, idProd);
}

async function getProductById({ id }) {
    return ProductoService.getInstance().getProductById(id);
}

async function createProduct({ data }) {
    return ProductoService.getInstance().create(data);
}

async function updateProductById({ id, data }) {
    return ProductoService.getInstance().updateProductById(id, data);
}

async function deleteProductById({ id }) {
    return ProductoService.getInstance().deleteById(id);
}

app.use(
    '/graphql',
    graphqlHTTP({
        schemaGraph,
        rootValue: {
            getAllCarritos,
            getAllProductos,
            createCarrito,
            deleteCarritoById,
            getAllProductsFromCartById,
            saveProductToCart,
            deleteProductFromCart,
            getProductById,
            createProduct,
            updateProductById,
            deleteProductById
        },
        graphiql: true
    }
    )
);

// Normalizr
const user = new schema.Entity('users')
const message = new schema.Entity('messages', {
    messenger: user
})
const messageSchema = new schema.Entity('message', {
    author: user,
    messages: [message]
})

// ===== Routes =====
// Index log in
app.get('/', (req, res) => {
    if (req.session.username) {
        res.send(`Logged in as ${req.session.username}`)
    } else {
        res.render('login.ejs', {})
    }
})

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
httpServer.listen(process.env.PORT || 80)
console.log(`Listening on PORT ${process.env.PORT || 80}`)
httpServer.on('error', error => console.log(`Error found: ${error}`))