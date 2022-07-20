const socket = io.connect()

socket.on('messages', normalizedData => {
    const user = new normalizr.schema.Entity('users')
    const message = new normalizr.schema.Entity('messages', {
        messenger: user
    })
    const messageSchema = new normalizr.schema.Entity('message', {
        author: user,
        messages: [message]
    })
    const denormalizedData = normalizr.denormalize(normalizedData.result, [messageSchema], normalizedData.entities)
    const nPercentage = JSON.stringify(normalizedData).length
    const dnPercentage = JSON.stringify(denormalizedData).length
    const compressionPercentage = Math.round((dnPercentage / nPercentage) * 100)
    renderMessages(denormalizedData, compressionPercentage)
})

// --- Function: show/render messages
const renderMessages = (messages, compressionPercentage) => {
    if (messages) {
        const content = messages.map((msg) => {
            return(`
                <div class="messageStyle">
                    <img src=${msg.author.avatar} class="imgAvatar" alt='avatar' /><strong>${msg.author.username} <span class="hourStyle">${msg.author.timestamp}</span></strong>
                    <div>${msg.text}</div>
                </div>
            `)
        }).join(' ')
        document.getElementById('compression').innerHTML = 'Chat compression: ' + compressionPercentage + '%'
        document.getElementById('messages').innerHTML = content
    }
}

// --- Function: add a meessage
const addMessage = (e) => {
    e.preventDefault()
    let id = document.getElementById('idmail')
    let fname = document.getElementById('fname')
    let lname = document.getElementById('lname')
    let age = document.getElementById('age')
    let username = document.getElementById('username')
    let avatar = document.getElementById('avatar')
    let message = document.getElementById('message')
    if (id.value && fname.value && lname.value && age.value && username.value && avatar.value && message.value) {
        const msg = {
            author: {
                id: id.value,
                name: fname.value,
                lastname: lname.value,
                age: age.value,
                username: username.value,
                avatar: avatar.value,
                timestamp: new Date().toLocaleString()
            },
            text: message.value,
        }
        socket.emit('newMessage', msg)
        id.value = ''
        fname.value = ''
        lname.value = ''
        age.value = ''
        username.value = ''
        avatar.value = ''
        message.value = ''
    } else {
        id.value ? null : id.style.border = '2px solid red'
        fname.value ? null : fname.style.border = '2px solid red'
        lname.value ? null : username.style.border = '2px solid red'
        age.value ? null : age.style.border = '2px solid red'
        username.value ? null : username.style.border = '2px solid red'
        avatar.value ? null : avatar.style.border = '2px solid red'
        message.value ? null : message.style.border = '2px solid red'
    }
}

// --- Event listeners
document.getElementById('msgForm').addEventListener('submit', addMessage)