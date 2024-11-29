const postLoggerSchema = {
  type: 'object',
  properties: {
    app_id: { type: 'string', example: '' },
    api_url: { type: 'string', example: '' },
    body: { type: 'string', example: '' },
    response: { type: 'string', example: '' },
    request_at: { type: 'string', example: '' },
  }
}

const postLogger = {
  tags: ['Logger'],
  summary: 'Post new logger',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/postLoggerSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Logger'
    },
  }
}

module.exports = {
  postLoggerSchema,
  postLogger
}