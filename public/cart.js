// --- Function: delete product from cart using ID
const deleteCartProduct = (id) => {
    fetch(`http://localhost:80/carts/${id}`, { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.href = 'http://localhost:80/carts'
    })
}

// --- Function: delete all products from cart
const deleteCartAll = () => {
    fetch(`http://localhost:80/carts/deleteAll`, { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.href = 'http://localhost:80/carts'
    })
}

// --- Function: send order fetch
const send = (order) => {
    fetch('http://localhost:80/carts/purchase', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: order
    })
    .then(() => {
        window.location.href = 'http://localhost:80/products'
    })
}