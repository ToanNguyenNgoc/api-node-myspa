const jwt = require("jsonwebtoken")

const SepayMiddle = {
  verifyIpn: async (req, res, next) => {
    const xSecretKey = req.headers['x-secret-key'];
    if (xSecretKey !== process.env.SEPAY_IPN_SECRET_KEY) return res.status(401).json({ status: false, message: "Unauthenticated!" });
    next();
  }
}

module.exports = SepayMiddle