const putBrandAppConfSchema = {
  type: 'object',
  properties: {
    is_on_service: { type: 'boolean' },
    is_on_product: { type: 'boolean' },
    is_on_payment_sdk: { type: 'boolean' }
  }
}
const postBrandAppConfSchema = {
  type: 'object',
  properties: {
    subdomain: { type: 'string', example: 'test' },
    is_on_service: { type: 'boolean' },
    is_on_product: { type: 'boolean' },
    is_on_payment_sdk: { type: 'boolean' }
  }
}

const getBrandAppConf = {
  tags: ['Brand App Conf'],
  summary: 'Return brand app conf detail',
  parameters: [
    {
      name: 'subdomain',
      type: 'string',
      in: 'path',
      description: 'The subdomain',
      required: true
    },
  ],
  responses: {
    '200': {
      description: 'The brand app config detail'
    },
  }
}
const postBrandAppConf = {
  tags: ['Brand App Conf'],
  summary: 'Post new brand app conf',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/postBrandAppConfSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'The new brand app conf'
    },
  }
}

const putBrandAppConf = {
  tags: ['Brand App Conf'],
  summary: 'Post new brand app conf',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'subdomain',
      type: 'string',
      in: 'path',
      description: 'The subdomain',
      required: true
    }
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/putBrandAppConfSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'The new brand app conf update'
    },
  }
}

module.exports = {
  getBrandAppConf,
  postBrandAppConf,
  putBrandAppConf,
  postBrandAppConfSchema,
  putBrandAppConfSchema
}