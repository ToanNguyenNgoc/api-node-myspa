const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', example: 'example@myspa.vn' },
    password: { type: 'string' }
  }
}
const loginBtxSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', example: 'example@myspa.vn' },
    password: { type: 'string' },
    platform: { type: 'string' }
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
const loginBtx = {
  tags: ['Auth'],
  summary: 'Auth login',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/loginBtxSchema',
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
module.exports = { login, loginSchema, loginBtx, loginBtxSchema }