const getManagerTrackingUrls = {
  tags: ['ManagerTracking'],
  summary: 'Returns the list of all the manager tracking urls',
  parameters: [
    {
      name: 'page',
      in: 'query',
      type: 'integer',
      default: 1
    },
    {
      name: 'limit',
      in: 'query',
      type: 'integer',
      default: 15
    },
    {
      name: 'search',
      in: 'query',
      type: 'string',
      description: 'Allow search url'
    },
    {
      name: 'items',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['0','1']
      },
      description: '0: hidden, 1: show'
    },
    {
      name: 'sort',
      in: 'query',
      type: 'string',
      description: 'count_item,-count_item'
    },
  ],
  responses: {
    '200': {
      description: 'The list of the manager tracking urls'
    },
  },
}


const getManagerTrackings = {
  tags: ['ManagerTracking'],
  summary: 'Returns the list of all the manager trackings',
  parameters: [
    {
      name: 'page',
      in: 'query',
      type: 'integer',
      default: 1
    },
    {
      name: 'limit',
      in: 'query',
      type: 'integer',
      default: 15
    },
    {
      name: 'search',
      in: 'query',
      type: 'string',
      description: 'Allow search api_url, id_address, ip_device, device, screen, '
    },
    {
      name: 'subdomain',
      in: 'query',
      type: 'string',
      description: 'Get list of the manager trackings by subdomain'
    },
    {
      name: 'method',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
      },
      description: 'HTTP method to filter by'
    },
    {
      name: 'type',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['API', 'WEBVIEW']
      },
      description: 'Get list of the manager trackings by type'
    }
  ],
  responses: {
    '200': {
      description: 'The list of the manager trackings'
    },
  },
}

const postManagerTrackingSchema = {
  type: 'object',
  properties: {
    subdomain: { type: 'string', example: 'demo' },
    api_url: {},
    header: { type: 'string', example: '{}' },
    ip_address: {},
    ip_device: {},
    device: {},
    screen: { type: 'string', example: 'HomeScreen' },
    method: { type: 'string', example: 'GET' },
    payload: { type: 'string', example: '{}' },
    type: { type: 'string', example: 'API' },
  }
}

const postManagerTracking = {
  tags: ['ManagerTracking'],
  summary: 'Post new manager tracking',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/postManagerTrackingSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'The new manager tracking'
    },
  }
}

module.exports = {
  getManagerTrackingUrls,
  getManagerTrackings,
  postManagerTracking, postManagerTrackingSchema,
};