const URL = "http://localhost:80"
const request = require("supertest")(URL)
const expect = require("chai").expect

const id = "632203333c5bd5c75b299119" // ID del producto Dying Light en Mongo Atlas
const url = "/products" // URL correcta
const incorrectURL = "/productosusjf" // URL incorrecta
const urlId = `/products/${id}` // URL correcta de producto Dying Light
const urlIdnonExistence = `/products/700` // URL de producto inexistente

const product = {
    _id: "632203333c5bd5c75b299119",
    title: "Dying Light",
    price: 22,
    img: "https://image.api.playstation.com/vulcan/img/rnd/202011/1204/wYL4v2r8uMQFvVTJlfuj8ICk.png"
}

const editedProduct = {
    title: "Dying Light 2",
    price: 55,
    img: "https://image.api.playstation.com/vulcan/img/rnd/202011/1204/wYL4v2r8uMQFvVTJlfuj8ICk.png"
}

const newProduct = {
    title: "Rocket League",
    price: 5,
    img: "https://assets1.ignimgs.com/2019/08/26/rocket-league---button-fin-1566850630208.jpg"
}

describe("Test API REST", () => {
    describe(`[TEST 1] URL /products incorrecta ${URL}${incorrectURL} (GET)`, () => {
        it("Should return status 404.", async () => {
            const response = await request.get(incorrectURL)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })

    describe(`[TEST 2] URL /products correcta ${url} (GET)`, () => {
        it(`Should return status 200`, async () => {
            const response = await request.get(url)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
        })
    })

    describe(`[TEST 3] URL correcta /products/:id ${urlId} (GET)`, () => {
        it("Should return status 200", async () => {
            const response = await request.get(urlId)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
            const producto = response.body
            console.log(producto)
        })
    })

    describe(`[TEST 4] URL incorrecta /products/:id ${URL}${urlIdnonExistence} (GET)`, () => {
        it("Should return 404", async () => {
            const response = await request.get(`${URL}${urlIdnonExistence}`)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })

    describe(`[TEST 5] URL correcta /products agregar producto ${url} (POST)`, () => {
        it("Should add a product", async () => {
            const response = await request
                .post(url)
                .set("admin", "true")
                .send(newProduct)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
        })
    })

    describe(`[TEST 6] URL correcta /products agregar producto vacio ${URL}${url} (POST)`, () => {
        it("Should not add an empty product.", async () => {
            const response = await request.post(`${URL}${url}`).set("admin", "true").send({})
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })

    describe(`[TEST 7] URL correcta /products/:id ${url}/${product._id} (PUT)`, () => {
        it("Modify product by id", async () => {
            const response = await request
                .put(url + `/${product._id}`)
                .set("admin", "true")
                .send(editedProduct)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
        })
    })

    describe(`[TEST 8] URL correcta /products/:id ${urlId} (DELETE)`, () => {
        it("Should delete product by id)", async () => {
            const response = await request.delete(urlId).set("admin", "true").send()
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
        })
    })

    describe(`[TEST 9] URL incorrecta /products/:id producto inexistente ${URL}${urlIdnonExistence} (PUT)`, () => {
        it("Should not update anything, and return status 404", async () => {
            const response = await request.put(`${URL}${urlIdnonExistence}`).send(product)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })

    describe(`[TEST 10] URL incorrecta /products/:id producto inexistente ${URL}${urlIdnonExistence} (DELETE)`, () => {
        it("Should not delete anything, and return status 404", async () => {
            const response = await request.delete(`${URL}${urlIdnonExistence}`).send()
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })
})