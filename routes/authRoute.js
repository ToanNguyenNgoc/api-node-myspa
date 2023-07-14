const route = require("express").Router()
const authController = require("../controllers/authController")

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The auth managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email
 *         password:
 *           type: string
 *           description: The password
 *       example:
 *         email: string
 *         password: string
 */

route.post("/register", authController.registerUser)
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Auth login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
*     responses:
 *       200:
 *         description: Return user information
 */
route.post("/login", authController.loginUser)

module.exports = route