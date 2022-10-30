const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const emailNotification = process.env.EMAIL
const userModel = require('../model/user.model')

// Register an account
const renderRegisterPageController = (req, res) => {
    res.render('register.ejs', {})
}

// Register successful
const postRegisterController = (req, res) => {
    const { username, email, password, fname, address, age, phone, userImage } = req.body
    const rounds = 10
    const transporter = nodemailer.createTransport ({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: emailNotification,
            pass: 'bmhefmnvcnbcfdgh'
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    bcrypt.hash(password, rounds, (error, hash) => {
        if (error) {
            console.error(error)
            return
        }
        const newUser = new userModel({
            username: username,
            password: hash,
            email: email,
            fname: fname,
            address: address,
            age: age,
            phone: phone,
            userImage: userImage,
            role: 'user'
        })
        userModel.findOne({email: email}, (error, foundItem) => {
            if (error) {
                console.log(error)
                res.send(error)
            } else {
                if (foundItem) {
                    res.render('error-auth.ejs', {error: 'This email is already in use!'})
                } else {
                    newUser.save()
                    .then(() => {
                        console.log('New user registered!')
                        res.render('registered.ejs', {username})
                        transporter.sendMail({
                            from: emailNotification,
                            to: [emailNotification],
                            subject: 'New user registered',
                            html:
                                `
                                    <h2>User created with username: ${username}</h2>
                                    <ul>
                                        <li>Nombre: ${fname}</li>
                                        <li>Email: ${email}</li>
                                        <li>Address: ${address}</li>
                                        <li>Age: ${age}</li>
                                        <li>Phone: ${phone}</li>
                                    </ul>
                                `
                        })
                        .then(res => console.log(res))
                        .catch(err => console.log(err))
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            }
        })
    })
}

module.exports = {renderRegisterPageController, postRegisterController}