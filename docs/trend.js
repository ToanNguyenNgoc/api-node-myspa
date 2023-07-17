const getTrends = {
  tags: ['Trends'],
  summary: 'Returns the list of all the trends',
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
      name: 'filter[organization_id]',
      in: 'query',
      type: 'integer',
      description: 'Get list of the trends by organization_id'
    },
    {
      name: 'include',
      in: 'query',
      type: 'string',
      description: 'Example: comments'
    }
  ],
  responses: {
    '200': {
      description: 'The list of the trends'
    },
  },
}

const getTrend = {
  tags: ['Trends'],
  summary: 'Return trend detail by id',
  parameters: [
    {
      name: 'id',
      type: 'integer',
      in: 'path',
      description: 'The trend id',
      required: true
    },
    {
      name: 'include',
      type: 'string',
      in: 'query',
      description: 'Example: tiktok|services'
    }
  ],
  responses: {
    '200': {
      description: 'The trend description by id'
    },
  }
}
const postTrend = {
  tags: ['Trends'],
  summary: 'Post new trend',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/postTrendSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'The new trend'
    },
  }
}
const putTrend = {
  tags: ['Trends'],
  summary: 'Put trend',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      type: 'integer',
      in: 'path',
      description: 'The trend id',
      required: true
    }
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/putTrendSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'The new trend'
    },
  }
}
const postTrendSchema = {
  type: 'object',
  properties: {
    media_url: {},
    image_thumb: {},
    title: {},
    content: {},
    trend_url: {},
    organization_id: { type: 'number', example: 115 },
    services: { type: 'array', example: [24] },
  }
}
const putTrendSchema = {
  type: 'object',
  properties: {
    media_url: {},
    image_thumb: {},
    title: {},
    content: {},
  }
}
module.exports = {
  getTrends, getTrend, postTrend, putTrend,
  postTrendSchema, putTrendSchema
}