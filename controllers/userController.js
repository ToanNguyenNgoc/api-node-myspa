const User = require("../models/user.module")
const verifyToken = require('../utils/verifyToken')



const userController = {
    getUsers: async (req, res) => {
        try {
            const response = await User.find();
            res.status(200).json({ status: true, data: response })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    //GET: user profile
    getUserProfile: async (req, res) => {
        try {
            const { error, user_access } = await verifyToken(req, res)
            if (error) res.status(401).json({ status: false, message: "Unauthenticated" })
            if (user_access) {
                const user_response = await User.findById(user_access.id)
                const { password, ...other } = user_response._doc
                res.status(200).json({ status: true, data: { ...other } })
                // res.status(200).json({ status: true, data: { user_response } })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    //PUT: user profile
}

module.exports = userController