const axios = require('axios');

const recaptchaMiddleware = {
  verify: (req, res, next) => {
    const recaptcha = req.body.recaptcha || req.query.recaptcha
    if (!recaptcha || recaptcha === '') {
      return res.status(401).send({ statusCode: 401, message: 'Recaptcha is required' })
    }
    if (recaptcha === process.env.RECAPTCHA_SITE_KEY_HARD_CODE) {
      next()
    } else {
      const secretKey = process.env.RECAPTCHA_SITE_KEY_SERVER;
      const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + recaptcha + "&remoteip=" + req.connection.remoteAddress;
      axios.get(verificationURL)
        .then(responseRecaptcha => {
          if (!responseRecaptcha.data.success) return res.status(401).send({ statusCode: 401, message: 'Recaptcha is invalid' })
          next()
        })
        .catch(() => res.status(401).send({ statusCode: 401, message: 'Recaptcha is invalid!' }))
    }
  },
  verifyApi: (req, res, next) => {
    const recaptcha = req.body.recaptcha || req.query.recaptcha
    if (!recaptcha || recaptcha === '') {
      return res.status(401).send({ statusCode: 401, message: 'Recaptcha is required' })
    }
    if (recaptcha === process.env.RECAPTCHA_APP_CLIENT_RECAPTCHA) {
      next()
    } else {
      const secretKey = process.env.RECAPTCHA_APP_SERVER_RECAPTCHA;
      const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + recaptcha + "&remoteip=" + req.connection.remoteAddress;
      axios.get(verificationURL)
        .then(responseRecaptcha => {
          if (!responseRecaptcha.data.success) return res.status(401).send({ statusCode: 401, message: 'Recaptcha is invalid' })
          next()
        })
        .catch(() => res.status(401).send({ statusCode: 401, message: 'Recaptcha is invalid!' }))
    }
  }
}

module.exports = recaptchaMiddleware