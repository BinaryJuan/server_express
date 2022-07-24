// --- Function: return the new edited product
const editedProduct = () => {
    const product = {
        title: document.getElementById('title').value || 'empty',
        price: document.getElementById('price').value || 'empty',
        img: document.getElementById('img').value || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAwc8jGI4J4x33_FM8BpeTiFoiPaRZqbAwjQkQzVtflxCi_jwy8titZTn_jQ87Bd736M0&usqp=CAU'
    }
    return product
}

// --- Function: edit a product by ID
const editProduct = (id) => {
    fetch(`http://localhost:8080/products/${id}`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify(editedProduct())
    })
    .then(() => {
        window.location.href = 'http://localhost:8080/products'
    })
}

// --- Event listeners
document.getElementById('productEdit').addEventListener('submit', function(e) {
    e.preventDefault()
})