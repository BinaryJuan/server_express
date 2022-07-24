// --- Function: delete product from cart using ID
const deleteCartProduct = (id) => {
    fetch(`http://localhost:8080/carts/${id}`, { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.href = 'http://localhost:8080/carts'
    })
}

// --- Function: delete cart
const deleteCart = () => {
    fetch("http://localhost:8080/carts", { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.href = 'http://localhost:8080/carts'
    })
}