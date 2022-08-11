// Generate random numbers based on input
process.on('message', cant => {
    const repeated = {}
    for (let i = 0; i < cant; i++) {
        const aleatorio = Math.floor((1 + Math.random() * 1000))
        if (repeated[aleatorio]) {
            repeated[aleatorio]++
        } else {
            repeated[aleatorio] = 1
        }
    }
    process.send(repeated)
})