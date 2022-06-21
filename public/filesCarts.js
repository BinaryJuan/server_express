const fs = require('fs')

class ContainerCarts {
    constructor(nombreArchivo) {
        this.archivo = nombreArchivo
        this.data = []

        try {
            this.init()
        }
        catch(error) {
            console.log(`Error Initializing ${error}`)
        }
    }

    async init() {
        this.data = await this.getAll()
    }

    async save(objeto) {
        try {
            await this.init()
            objeto = {...objeto, id: this.data.length + 1}
            this.data.push(objeto)
            await fs.promises.appendFile(this.archivo, JSON.stringify(objeto) + '\n')
            return objeto.id
        }
        catch (error) {
            console.log(error)
        }
    }

    async getAll() {
        try {
            let objetosJSON = await fs.promises.readFile(this.archivo, 'utf-8')
            let objSwap = objetosJSON.split('\n').filter(obj => obj != '')
            let objetos = objSwap.map(obj => JSON.parse(obj))
            return objetos
        }
        catch (error) {
            console.log(error)
        }
    }

    async getById(id) {
        try {
            let carts = await this.getAll()
            let coincidencia = null
            carts.forEach(cart => {
                if (cart.id === id) {
                    coincidencia = cart
                }
            })
            return coincidencia
        }
        catch (error) {
            console.log(error)
        }
    }

    async write(carts) {
        await fs.promises.writeFile(this.archivo, '')
        carts.forEach(prod => {
            fs.promises.appendFile(this.archivo, JSON.stringify(prod) + '\n')
        })
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.archivo, '')
        }
        catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {
        try {
            let carts = await this.getAll()
            let cartsCargar = carts.filter(obj => obj.id !== id)
            this.deleteAll()
            cartsCargar.forEach(obj => fs.promises.appendFile(this.archivo, JSON.stringify(obj) + '\n'))
        }
        catch (error) {
            console.log(error)
        }
    }

    async existsById(id) {
        try {
            let carts = await this.getAll()
            let exists = [false, null, null]
            carts.forEach((cart, index) => {
                if (cart.id === id) {
                    exists = [true, cart, index]
                }
            })
            return exists
        }
        catch {
            console.log(error)
        }
    }

    async deleteCartProductById(cartID, prodID) {
        try {
            let array = await this.existsById(cartID)
            if (array[0]) {
                let cart = array[1]
                let prodPosition
                let productExists = false
                cart.products.forEach((prod, index) => {
                    if (prod.id == prodID) {
                        productExists = true
                        prodPosition = index
                    }
                })
                if (productExists) {
                    cart.products.splice(prodPosition, 1)
                    let cartsArray = this.data
                    cartsArray[array[2]] = cart
                    this.write(cartsArray)
                } else {
                    console.log('The product in cart does not exist')
                }
                return productExists
            } else {
                console.log('The cart does not exist')
            }
        }
        catch {
            console.log(error)
        }
    }
}

module.exports = ContainerCarts