// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.JWT_KEY);
//         req.userData = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             message: 'Auth failed'
//         });
//     }
// };

const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const cache = new NodeCache();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      return res.json({ message: "Not Authorize." });
    }

    // Check cache first
    const cachedToken = cache.get(jwtToken);
    if (cachedToken) {
      req.user = cachedToken;
      return next();
    }

    const payload = jwt.verify(jwtToken, process.env.JWT_KEY);
    req.user = payload.user;

    // Cache the token with a TTL (Time To Live)
    cache.set(jwtToken, payload.user, 3600); // Cache for 1 hour
    next();
  } catch (err) {
    return res.json({ message: "Auth failed", error: err.message });
  }
};
