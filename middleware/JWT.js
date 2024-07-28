// const jwt = require('jsonwebtoken')
// const cookie = require('cookie-parser')

// const loginrequired = async(req, res, next) => {
//     const token = req.cookie['access-token']
//     if(token){
//         const validatetoken = await jwt.verify(token, process.env.JWT_SIGNIN_KEY)
//         if(validatetoken){
//             res.user = validatetoken.id
//             next()
//         }
//         else {
//             console.log('token expires');
//             res.redirect('/user/login')
//         }
//     }
//     else{
//         console.log('token not found');
//         res.redirect('/user/login')
//     }
// }

// module.exports = { loginrequired }

const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const cache = new NodeCache();

const loginrequired = async (req, res, next) => {
    const token = req.cookies['access-token'];
    if (token) {
        // Check cache first
        const cachedToken = cache.get(token);
        if (cachedToken) {
            req.user = cachedToken;
            return next();
        }

        try {
            const validatetoken = await jwt.verify(token, process.env.JWT_SIGNIN_KEY);
            if (validatetoken) {
                req.user = validatetoken.id;
                // Cache the token with a TTL (Time To Live)
                cache.set(token, validatetoken.id, 3600); // Cache for 1 hour
                return next();
            } else {
                console.log('Token expired');
                res.redirect('/user/login');
            }
        } catch (err) {
            console.log('Token verification failed:', err.message);
            res.redirect('/user/login');
        }
    } else {
        console.log('Token not found');
        res.redirect('/user/login');
    }
};

module.exports = { loginrequired };
