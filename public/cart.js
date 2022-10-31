// --- Function: delete product from cart using ID
const deleteCartProduct = (id) => {
    fetch(`/carts/${id}`, { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.href = '/carts'
    })
}

// --- Function: delete all products from cart
const deleteCartAll = () => {
    fetch(`/carts/deleteAll`, { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.href = '/carts'
    })
}

// --- Function: send order fetch
const send = (order) => {
    fetch('carts/purchase', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: order
    })
    .then(() => {
        window.location.href = '/products'
    })
}