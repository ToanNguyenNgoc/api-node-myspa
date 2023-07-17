const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', example: 'example@myspa.vn' },
    password: { type: 'string' }
  }
}

const login = {
  tags: ['Auth'],
  summary: 'Auth login',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/loginSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Return user information'
    }
  }
}
module.exports = { login, loginSchema }