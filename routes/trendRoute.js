const route = require('express').Router()
const authMiddle = require('../middleware/authMiddle')
const trendController = require('../controllers/trendController')

/**
 * @swagger
 * tags:
 *   name: Trends
 *   description: The trends managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     trend:
 *       type: object
 *       required:
 *         - media_url
 *         - image_thumb
 *         - title
 *         - content
 *         - trend_url
 *         - organization_id
 *         - services
 *       properties:
 *         media_url:
 *           type: string
 *         image_thumb:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         trend_url:
 *           type: string
 *         organization_id:
 *           type: number
 *         services:
 *           type: array
 *       example:
 *         media_url: string
 *         image_thumb: string
 *         title: string
 *         content: string
 *         trend_url: string
 *         organization_id: 115
 *         services: [24]
 *     put trend:
 *       type: object
 *       properties:
 *         media_url:
 *           type: string
 *         image_thumb:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *       example:
 *          media_url: string   
 *          image_thumb: string
 *          title: string
 *          content: string 
 */

/**
 * @swagger
 * /trends:
 *   get:
 *     summary: Returns the list of all the trends
 *     tags: [Trends]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *       - in: query
 *         name: filter[organization_id]
 *         schema:
 *           type: integer
 *         description: Get list of the trends by organization_id
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: "Example: comments"
 *     responses:
 *       200:
 *         description: The list of the trends
 */
route.get('/', trendController.getAll)
/**
 * @swagger
 * /trends/{id}:
 *   get:
 *     summary: Return trend detail by id
 *     tags: [Trends]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The trend id
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: "Example: tiktok|services"
 *     responses:
 *       200:
 *         description: The trend description by id
 */
route.get('/:id', trendController.getById)

/**
 * @swagger
 * /trends:
 *   post:
 *     summary: Post new trend
 *     tags: [Trends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/trend'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return new trend
 */
route.post('/', authMiddle.verifyToken, trendController.post)

/**
 * @swagger
 * /trends/{id}:
 *   put:
 *     summary: Put trend
 *     tags: [Trends]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The trend id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/put trend'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return new trend
 */
route.put('/:id', authMiddle.verifyToken, trendController.update)

module.exports = route