const User = require("../models/user.module")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)
            const newUser = await new User({
                ...req.body,
                password: hashed
            })
            const user = await newUser.save()
            res.status(200).json({ status: true, data: user })
        } catch (error) {
            res.status(500).json(err)
        }
    },

    loginUser: async (req, res) => {
        try {
            const email = req.body.email
            const password = req.body.password
            const user = await User.findOne({ email: email })
            if (!user) return res.status(404).json({ status: false, message: `Email ${email} is not registered !` })
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) return res.status(403).json({ status: false, message: "Wrong password !" })

            if (user && validPassword) {
                const token = jwt.sign({
                    id: user.id,
                    admin: user.admin
                }, "TOKEN_KEY", { expiresIn: "10d" })
                const { password, ...res_user } = user._doc
                res.status(200).json({ status: true, context: { ...res_user, token: token } })
            }
        } catch (error) {
            res.status(500).json(err)
        }
    }
}


module.exports = authController