// NOTA: todos los metodos fueron testeados en el navegador, exceptuando el metodo PUT (postman)
// ___Imports___
const express = require('express')
const bodyParser = require('body-parser')
const { Router } = express
const Contenedor = require('./archivos')
const products = new Contenedor('products.txt')

// ===== SERVER =====
const app = express()
const router = Router()

app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname +'/public'))
app.use('/api/products', router)

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html')
})

// a. Devuelve todos los productos
router.get('/', (request, response) => {
    products.getAll()
    .then((productList) => {
        response.json(productList)
    })
})

// b. Devuelve un producto según su ID
router.get('/:id', (request, response) => {
    const id = Number(request.params.id)
    products.getById(id)
    .then((objProduct) => {
        objProduct ? response.json(objProduct) : response.send({error: 'Product not found.'})
    })
})

// c. Recibe y agrega un producto
app.get('/addProduct', ( request, response ) => {
    response.sendFile(__dirname + '/public/form.html')
})

router.post('/', (request, response) => {
    let { title, price, img } = request.body
    price = Number(price)
    products.save({title, price, img})
    products.init()
    response.send({message: 'Product added successfully.'})
})

// d. Recibe y actualiza un producto según su ID
router.put('/:id', (request, response) => {
    const { id } = request.params
    const field = Object.keys(request.body)[0]
    const value = Object.values(request.body)[0]
    products.getById(Number(id))
    .then((objProduct) => {
        if (objProduct) {
            products.editById(Number(id), field, value)
            response.send({message: `Modified product with ID #${id} field (${field}) value (${value})`})
        } else {
            response.send({error: 'Product not found.'})
        }
    })
})

// e. Elimina un producto según su ID
router.delete('/:id', (request, response) => {
    const id = Number(request.params.id)
    products.getById(id)
    .then((objProduct) => {
        if (objProduct) {
            products.deleteById(id)
            response.send('Product deleted.')
        } else {
            response.send({error: 'Product not found.'})
        }
    })
})

// ------- Iniciando server -------
const server = app.listen(process.env.PORT || 8080)
server.on('error', error => console.log(`Error found: ${error}`))