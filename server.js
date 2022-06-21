// ___Imports___
const express = require('express')
const { Router } = express
const bodyParser = require('body-parser')
const ContainerProducts = require('./public/filesProducts')
const ContainerCarts = require('./public/filesCarts')
const products = new ContainerProducts('./public/products.txt')
const carts = new ContainerCarts('./public/carts.txt')

// ======== SERVER ========
const app = express()
const routerProducts = Router()
const routerCart = Router()

// --- Server config. ---
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('views', './views')
app.set('view engine', 'ejs')

// --- Routes ---
// === Grupo A - productos
// 1. Devuelve todos los productos
routerProducts.get('/', (request, response) => {
    response.render('products.ejs', {products})
})

// 2. Devuelve un producto según su ID
routerProducts.get('/:id', (request, response) => {
    const id = Number(request.params.id)
    products.getById(id)
    .then((objProduct) => {
        objProduct ? response.render('productDetail.ejs', {objProduct}) : response.json({error: 'Product not found.'})
    })
})

// 3. Recibe y agrega un producto
app.get('/', (request, response) => {
    const admin = request.headers.admin
    if (admin == 'true') {
        products.init()
        response.render('form.ejs', {products})
    } else {
        const url = request.protocol + '://' + request.get('host') + request.originalUrl;
        response.json({error: -1, description: `URL "${url}" method not autorized.`})
    }
})

routerProducts.post('/', (request, response) => {
    const admin = request.headers.admin
    if (admin == 'true') {
        let { title, price, description, stock, img } = request.body
        price = Number(price)
        products.save({title, price, description, stock, img, timestamp: Date.now()})
        .then(() => {
            products.init()
            response.render('products.ejs', {products})
        })
    } else {
        const url = request.protocol + '://' + request.get('host') + request.originalUrl;
        response.json({error: -1, description: `URL "${url}" method not autorized.`})
    }
})

// 4. Recibe y actualiza un producto según su ID
routerProducts.put('/:id', (request, response) => {
    const admin = request.headers.admin
    if (admin == 'true') {
        const { id } = request.params
        const field = Object.keys(request.body)[0]
        const value = Object.values(request.body)[0]
        products.getById(Number(id))
        .then((objProduct) => {
            if (objProduct) {
                products.editById(Number(id), field, value)
                .then((edited) => {
                    if (edited) {
                        response.json({message: `Modified product with ID #${id} field (${field}) value (${value})`})
                    } else {
                        response.json({message: 'No edits were made since body was empty.'})
                    }
                })
            } else {
                response.json({error: 'Product not found.'})
            }
        })
    } else {
        const url = request.protocol + '://' + request.get('host') + request.originalUrl;
        response.json({error: -1, description: `URL "${url}" method not autorized.`})
    }
})

// 5. Elimina un producto según su ID
routerProducts.delete('/:id', (request, response) => {
    const admin = request.headers.admin
    if (admin == 'true') {
        const id = Number(request.params.id)
        products.getById(id)
        .then((objProduct) => {
            if (objProduct) {
                products.deleteById(id)
                response.json('Product deleted.')
            } else {
                response.json({error: 'Product not found.'})
            }
        })
    } else {
        const url = request.protocol + '://' + request.get('host') + request.originalUrl;
        response.json({error: -1, description: `URL "${url}" method not autorized.`})
    }
})

// === Grupo B - carrito
// 0. Muestra todos los carritos
routerCart.get('/', (request, response) => {
    response.json(carts.data)
})

// 1. Crea un carrito y devuelve el ID
routerCart.post('/', (request, response) => {
    carts.save({timestamp: Date.now(), products: []})
    .then((id) => {
        response.json(`New cart created with ID ${id}`)
    })
    carts.init()
})

// 2. Vacía un carrito y lo elimina
routerCart.delete('/:id', (request, response) => {
    const id = Number(request.params.id)
    carts.getById(id)
    .then((objProduct) => {
        if (objProduct) {
            carts.deleteById(id)
            response.json(`Cart with ID #${id} deleted successfully.`)
        } else {
            response.json({error: 'Cart not found.'})
        }
    })
})

// 3. Mostrar todos los productos guardados en un carrito
routerCart.get('/:id/products', (request, response) => {
    const id = Number(request.params.id)
    carts.getById(id)
    .then((cart) => {
        if (cart) {
            if (cart.products.length > 0) {
                response.json(cart.products)
            } else {
                response.json({message: 'This cart is empty.'})
            }
        } else {
            response.json({error: 'Cart not found.'})
        }
    })
})

// 4. Agregar un producto al carrito según su ID
routerCart.post('/:id/products', (request, response) => {
    const cartID = Number(request.params.id)
    let { id } = request.body
    carts.getById(cartID)
    .then((cart) => {
        if (cart) {
            const index = carts.data.findIndex(c => c.id == cart.id)
            products.getById(id)
            .then((prod) => {
                cart.products.push(prod)
                carts.data[index] = cart
                carts.write(carts.data)
                response.json({message: `Product (ID #${id}) added successfully to cart ID #${cartID}.`})
            })
        } else {
            response.json({error: 'Cart was not found.'})
        }
    })
})

//5. Eliminar un producto usando el ID del carrito y el ID del producto
routerCart.delete('/:id/products/:id_prod', (request, response) => {
    const cartID = Number(request.params.id)
    const prodID = Number(request.params.id_prod)
    carts.deleteCartProductById(cartID, prodID)
    .then((deleted) => {
        if (deleted) {
            response.json({message: 'Product in cart deleted successfully.'})
        } else {
            response.json({error: 'Product in cart could not be deleted.'})
        }
    })
})

// --- Router config. ---
app.use('/api/products', routerProducts) // Grupo A
app.use('/api/carts', routerCart) // Grupo B
app.use((request, response) => {
    const url = request.protocol + '://' + request.get('host') + request.originalUrl;
    response.json({error: -2, description: `URL "${url}" method not implemented`})
})

// ------- Iniciando server -------
const server = app.listen(process.env.PORT || 8080)
server.on('error', error => console.log(`Error found: ${error}`))