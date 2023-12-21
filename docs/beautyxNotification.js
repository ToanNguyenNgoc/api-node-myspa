const postNotification = {
  tags: ['BeautyxNotification'],
  summary: 'Post new notification',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/postNotificationSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'The new notification'
    },
  }
}

const postNotificationSchema = {
  type: 'object',
  properties: {
    title: {},
    description: {},
    type: {},
    link: {},
    payload_id: {},
  }
}

module.exports = {
  postNotification,
  postNotificationSchema
}