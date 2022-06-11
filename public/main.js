//  === FRONTEND ===  //
const socket = io.connect()

// --- Function: show/render products
const renderProducts = (products) => {
    const content = products.map((prod) => {
        return (`
            <tr class="trStyle">
                <td>${prod.title}</td>
                <td>$${prod.price} USD</td>
                <td style="text-align:center;"><img src=${prod.img} style="width:150px;" alt="product" /></td>
            </tr>
        `)
    }).join(' ')
    document.getElementById('productList').innerHTML = content
}

// --- Function: show/render messages
const renderMessages = (messages) => {
    const content = messages.map((msg) => {
        return(`
            <div class="messageStyle">
                <strong>${msg.user} <span class="hourStyle">${msg.hour}</span></strong>
                <div>${msg.message}</div>
            </div>
        `)
    }).join(' ')
    document.getElementById('messages').innerHTML = content
}

// --- Function: add a product
const addProduct = (e) => {
    e.preventDefault()
    let title = document.getElementById('title')
    let price = document.getElementById('price')
    let img = document.getElementById('img')
    title.style.border = '1px solid grey'
    price.style.border = '1px solid grey'
    img.style.border = '1px solid grey'
    if (title.value && price.value && img.value) {
        const newProduct = {
            title: title.value,
            price: price.value,
            img: img.value
        }
        socket.emit('newProduct', newProduct)
        title.value = ''
        price.value = ''
        img.value = ''
    } else {
        title.value ? null : title.style.border = '2px solid red'
        price.value ? null : price.style.border = '2px solid red'
        img.value ? null : img.style.border = '2px solid red'
    }
}

// --- Function: add a meessage
const addMessage = (e) => {
    e.preventDefault()
    let username = document.getElementById('username')
    let message = document.getElementById('message')
    username.style.border = '1px solid grey'
    message.style.border = '1px solid grey'
    if (username.value && message.value) {
        const msg = {
            user: username.value,
            message: message.value,
            hour: new Date().toLocaleString()
        }
        socket.emit('newMessage', msg)
        username.value = ''
        message.value = ''
    } else {
        username.value ? null : username.style.border = '2px solid red'
        message.value ? null : message.style.border = '2px solid red'
    }
}

// --- Event listeners
document.getElementById('productForm').addEventListener('submit', addProduct)
document.getElementById('msgForm').addEventListener('submit', addMessage)

// --- Socket.on
socket.on('products', products => {
    renderProducts(products)
})
socket.on('messages', messages => {
    renderMessages(messages)
})