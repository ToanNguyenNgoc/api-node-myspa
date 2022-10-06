const jwt = require('jsonwebtoken')

const verifyToken = async (req, res) => {
    let error = false
    let user_access
    const token = req.headers.authorization
    if (!token) error = true
    if (token) {
        let user_token
        const accessToken = token.split(" ")[1]
        jwt.verify(accessToken, "TOKEN_KEY", (err, user) => {
            if (err) return res.status(403).json({ status: false, message: "Token is invalided ! " })
            user_token = user
        })
        user_access = user_token
    }
    return { error, user_access }
}
module.exports = verifyToken