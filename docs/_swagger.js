const dotenv = require('dotenv')
const { login, loginBtx, loginBtxSchema, loginSchema } = require('./auth')
const { getTrends, getTrend, postTrend, putTrend, postTrendSchema, putTrendSchema } = require('./trend')
const { getTrendComments, getRefreshTrend } = require('./trendComments')
const { postNotification, postNotificationSchema } = require('./beautyxNotification')
const { uploadMedia, uploadMultipleMedia, uploadMediaCloudinary } = require('./upload')
const { getBrandAppConf, postBrandAppConf, putBrandAppConf, postBrandAppConfSchema, putBrandAppConfSchema } = require('./brandAppConf')
const { getHistoryView } = require('./history')
const { postLogger, postLoggerSchema } = require('./logger.doc')
const { getOrders } = require('./order.doc')
dotenv.config()

const swagger = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Beautyx trends API Docs",
      version: "1.0.0",
      description: "Beautyx trends API Docs",
    },
    servers: [
      {
        url: process.env.DOMAIN_V1,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "Bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        loginSchema, loginBtxSchema, postTrendSchema, putTrendSchema,
        postNotificationSchema,
        postBrandAppConfSchema, putBrandAppConfSchema,
        postLoggerSchema
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Auth', description: 'The auth managing API' },
      { name: 'Trends', description: 'The trends managing API' },
      { name: 'Tiktok', description: 'The trend comments managing API' },
      // { name: 'History', description: 'The history & search history managing API' },
      { name: 'Upload', description: 'The uploads managing API' },
      { name: 'BeautyxNotification', description: 'The notification managing API' },
      { name: 'Brand App Conf', description: 'The brand app config' },
      { name: 'Logger', description: 'Log request' },
      { name: 'Orders', description: 'The orders managing API' }

    ],
    paths: {
      '/auth/login': { post: login },
      // '/auth/login/btx': { post: loginBtx },

      '/trends': { get: getTrends, post: postTrend },
      '/trends/{id}': { get: getTrend, put: putTrend },

      '/tiktok/getCommentsByUrl': { get: getTrendComments },
      '/tiktok/refresh_trend/{id}': { get: getRefreshTrend },

      // '/history': { get: getHistoryView },

      '/upload/media': { post: uploadMedia },
      '/upload/media_multiple': { post: uploadMultipleMedia },
      '/upload/cloudinary': { post: uploadMediaCloudinary },
      '/zalo/fcm-notification': { post: postNotification },

      '/brand-app': { post: postBrandAppConf },
      '/brand-app/{subdomain}': { get: getBrandAppConf, put: putBrandAppConf },

      '/loggers': { post: postLogger },

      '/notifications/order': { get: getOrders },

    },
  },
  apis: ["./routes/*.js"],
};
module.exports = swagger