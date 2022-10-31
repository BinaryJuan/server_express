// Profile
const getProfileController = (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            let userObject = req.session.userObject
            res.render('profile.ejs', {userObject})
        }
    } catch (err) {
        res.render('error.ejs', {err})
    }
}

module.exports = {getProfileController}