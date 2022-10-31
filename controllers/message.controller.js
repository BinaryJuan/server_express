const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

// --- Function: get all messages using 
const getAllMessages = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const email = req.params.email
        DAO.message.getByEmail(email)
        .then((messages) => {
            res.render('messages.ejs', {messages, email})
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

module.exports = {getAllMessages}