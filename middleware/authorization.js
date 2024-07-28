// const jwt = require("jsonwebtoken");
// const config = require("../utils/auth.config");
// module.exports = async (req, res, next) => {
//   try {
//     const jwtToken = req.header("token");
//     if (!jwtToken) {
//       return res.json({ message: "Not Authorize." });
//     }
//     const payload = jwt.verify(jwtToken, config.secret);
//     req.user = payload.user;
//   } catch (err) {
//     return res.json(err.message);
//   }

//   next();
// };

const jwt = require("jsonwebtoken");
const NodeCache = require('node-cache');
const cache = new NodeCache();
const config = require("../utils/auth.config");

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header("token");
        if (!jwtToken) {
            return res.json({ message: "Not Authorize." });
        }

        const cachedUser = cache.get(jwtToken);
        if (cachedUser) {
            req.user = cachedUser;
            return next();
        }

        const payload = jwt.verify(jwtToken, config.secret);
        req.user = payload.user;
        cache.set(jwtToken, payload.user, 3600); // Cache for 1 hour
    } catch (err) {
        return res.json(err.message);
    }

    next();
};

