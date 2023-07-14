const jwt = require("jsonwebtoken")

const authMiddleware = {
    verifyToken: async (req, res, next) => {
        const token = req.headers.authorization
        if (token) {
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, "TOKEN_KEY", (err, user) => {
                if (err) return res.status(401).json({ status: false, message: "Unauthenticated !" })
                next()
            })
        } else {
            return res.status(401).json({ status: false, message: "Unauthenticated !" })
        }
    }
}

module.exports = authMiddleware