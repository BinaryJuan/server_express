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

// --- Function: send order
const sendOrder = (order) => {
    const accountSid = 'ACdf3b937cf7d8a848f8922ae8edd23a03'; 
    const authToken = 'eda0cb244a3114e5a158e88922f7181e'; 
    const client = require('twilio')(accountSid, authToken); 

    client.messages 
        .create({ 
            body: JSON.stringify(order),
            from: 'whatsapp:+14155238886',      
            to: 'whatsapp:+5491131918140' 
        })
        .then(message => console.log(message.sid)) 
        .done();
}