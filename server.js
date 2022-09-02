const express = require('express')
require('./config')
const bodyParser = require('body-parser')
const http = require('http')
const { Server } = require('socket.io')
const FactoryDAO = require('./daos/index')
const contenedorMessages = require('./contenedores/contenedorMessages')
const messages = new contenedorMessages('DB_messages.json')
const { normalize, schema } = require('normalizr')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const argv = require('minimist')(process.argv.slice(2))
const { fork } = require('child_process')
//const logger = require("./logger")

// ======== SERVER ========
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

// --- Server config. ---
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    store: new mongoStore ({
        mongoUrl: 'mongodb+srv://admin:admin@desafioclase20.zbhpwfs.mongodb.net/sessions',
        mongoOptions: advancedOptions
    }),
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        expires: 600000
    }
}))
app.use(bodyParser.json())
/*app.use((req, res, next) => {
    logger.info(`Ruta: ${req.path}, Método: ${req.method}`)
    next()
})
*/
app.set('views', './views')
app.set('view engine', 'ejs')
const DAO = FactoryDAO()
const userSchema = {
    username: String,
    password: String,
    email: String,
    role: String
}
const userModel = mongoose.model('User', userSchema, 'users')

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
// Register an account - GET
app.get('/register', (req, res) => {
    res.render('register.ejs', {})
})
// Register successful - POST
app.post('/register', (req, res) => {
    const { username, email, password } = req.body
    const rounds = 10
    bcrypt.hash(password, rounds, (error, hash) => {
        if (error) {
            console.error(error)
            return
        }
        const newUser = new userModel({
            username: username,
            password: hash,
            email: email,
            role: 'admin'
        })
        userModel.findOne({email: email}, (error, foundItem) => {
            if (error) {
                console.log(error)
                res.send(error)
            } else {
                if (foundItem) {
                    res.render('error-auth.ejs', {error: 'This email is already in use'})
                } else {
                    newUser.save()
                    .then(() => {
                        console.log('New user registered')
                        res.render('registered.ejs', {username})
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            }
        })
    })
})
// Index log in
app.get('/', (req, res) => {
    if (req.session.username) {
        res.send(`Logged in as ${req.session.username}`)
    } else {
        res.render('login.ejs', {})
    }
})
// Index logged in - POST
app.post('/products-form', async (req, res) => {
    const { email, password } = req.body
    let sessionUsername
    userModel.findOne({email: email}, async (error, foundItem) => {
        if (error) {
            res.send(error)
        } else {
            if (foundItem) {
                const compare = await bcrypt.compare(password, foundItem.password)
                req.session.username = foundItem.username
                sessionUsername = foundItem.username
                if (compare) {
                    const products = await DAO.product.getAll()
                    res.render('form.ejs', {products, sessionUsername})
                } else {
                    res.render('error-auth.ejs', {error: 'Incorrect password'})
                }
            } else {
                res.render('error-auth.ejs', {error: 'Account not found'})
            }
        }
    })
})
// Index logged in - GET
app.get('/products-form', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const products = await DAO.product.getAll()
        const sessionUsername = req.session.username
        res.render('form.ejs', {products, sessionUsername})
    }
})
// Logout
app.get('/logout', (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const username = req.session.username
        req.session.destroy(err => {
            if (!err) {
                res.render('logout.ejs', {username})
            } else res.send({error: 'logout', body: err})
        })
    }
})
// Show info. - GET
app.get('/info', (req, res) => {
    const cpus = require('os').cpus().length
    res.send({
        inputArgs: argv,
        platform: process.platform,
        nodeVersion: process.versions.node,
        usedMemoryRRS: process.memoryUsage.rss(),
        exePath: process.execPath,
        pid: process.ppid,
        projectFolder: process.cwd(),
        numCPUs: cpus
    })
})
// Show randoms - GET
app.get('/randoms', (req, res) => {
    const cant = req.query.cant ? req.query.cant : 100000000
    const randomCompute = fork('randomCompute.js')
    randomCompute.send(cant)
    randomCompute.on('message', numeros => {
        res.send({
            active: 'randoms',
            randoms: numeros
        })
    })
})
// Products list - GET
app.get('/products', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const products = await DAO.product.getAll()
        const username = req.session.username
        res.render('products.ejs', {products, username})
    }
})
// Add body product - POST
app.post('/products', async (req, res) => {
    await DAO.product.save(req.body)
    const products = await DAO.product.getAll()
    const username = req.session.username
    res.render('products.ejs', {products, username})
})
// Product detail - GET
app.get('/products/:id', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const id = req.params.id
        const objProduct = await DAO.product.getByID(id)
        res.render('productDetail.ejs', {objProduct})
    }
})
// Delete product by ID - DELETE
app.delete('/products/:id', async (req, res) => {
    const id = Number(req.params.id)
    await DAO.product.deleteByID(id)
    res.send(`Product with ID #${id} deleted.`)
})
// Edit product form - GET
app.get('/products/edit/:id', async (req, res) => {
    const id = Number(req.params.id)
    const username = req.session.username
    const prod = await DAO.product.getByID(id)
    res.render('edit.ejs', {username, prod})
})
// Edit product by ID - PUT
app.put('/products/:id', async (req, res) => {
    const id = Number(req.params.id)
    await DAO.product.editById(req.body, id)
    const products = await DAO.product.getAll()
    const username = req.session.username
    res.render('products.ejs', {products, username})
})
// Get all carts - GET
app.get('/carts', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const carts = await DAO.cart.getAll()
        const username = req.session.username
        res.render('carts.ejs', {carts, username})
    }
})
// Add to cart - POST
app.post('/carts', async (req, res) => {
    const { addID } = req.body
    const productToAdd = await DAO.product.productExists(addID)
    if (productToAdd) {
        res.send(await DAO.cart.save(productToAdd))
    } else {
        res.send({error: 'The product does not belong to our inventory.'})
    }
})
// Delete a product in cart - DELETE
app.delete('/carts/:id', async (req, res) => {
    const id = req.params.id
    await DAO.cart.deleteByID(id)
    res.send(`Product with ID #${id} deleted from cart.`)
})
// Delete cart - DELETE
app.delete('/carts', async (req, res) => {
    await DAO.cart.deleteAll()
    res.send('All cart products deleted.')
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
httpServer.listen(process.env.PORT || 8080)
console.log(`Listening on PORT ${process.env.PORT || 8080}`)
httpServer.on('error', error => console.log(`Error found: ${error}`))