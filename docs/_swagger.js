const dotenv = require('dotenv')
const { login, loginSchema } = require('./auth')
const { getTrends, getTrend, postTrend, putTrend, postTrendSchema, putTrendSchema } = require('./trend')
const { getTrendComments } = require('./trendComments')
const { uploadMedia, uploadMultipleMedia, uploadMediaCloudinary } = require('./upload')
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
        loginSchema, postTrendSchema, putTrendSchema
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
      { name: 'TrendComments', description: 'The trend comments managing API' },
      { name: 'Upload', description: 'The uploads managing API' },
    ],
    paths: {
      '/auth/login': { post: login },

      '/trends': { get: getTrends, post: postTrend },
      '/trends/{id}': { get: getTrend, put: putTrend },

      '/tiktok/getCommentsByUrl': { get: getTrendComments },

      '/upload/media': { post: uploadMedia },
      '/upload/media_multiple': { post: uploadMultipleMedia },
      '/upload/cloudinary': { post: uploadMediaCloudinary }
    },
  },
  apis: ["./routes/*.js"],
};
module.exports = swagger