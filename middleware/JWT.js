const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')

const loginrequired = async(req, res, next) => {
    const token = req.cookie['access-token']
    if(token){
        const validatetoken = await jwt.verify(token, process.env.JWT_SIGNIN_KEY)
        if(validatetoken){
            res.user = validatetoken.id
            next()
        }
        else {
            console.log('token expires');
            res.redirect('/user/login')
        }
    }
    else{
        console.log('token not found');
        res.redirect('/user/login')
    }
}

module.exports = { loginrequired }