const getOrders = {
  tags: ['Orders'],
  summary: 'Returns the list of all the orders',
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
      name: 'filter[is_demo]',
      in: 'query',
      type: 'boolean',
      description: 'Get list of the orders by is_demo',
      enum: ['true', 'false'],
      default: true
    },
    {
      name: 'filter[is_read]',
      in: 'query',
      type: 'boolean',
      description: 'Get list of the orders by read',
      enum: ['true', 'false'],
    },
    {
      name: 'filter[platform]',
      in: 'query',
      type: 'string',
      description: 'Get list of the orders by platform'
    },
    {
      name: 'search_column',
      in: 'query',
      type: 'string',
      description: 'Example: user_name,user_telephone'
    },
    {
      name: 'search',
      in: 'query',
      type: 'string',
      description: 'Example: search keyword'
    }
  ],
  responses: {
    '200': {
      description: 'The list of the orders'
    },
  },
}

const getOrder = {
  tags: ['Orders'],
  summary: 'Return order detail by id',
  parameters: [
    {
      name: 'order_id',
      type: 'integer',
      in: 'path',
      description: 'The order id',
      required: true
    },
  ],
  responses: {
    '200': {
      description: 'The order description by id'
    },
  }
}

module.exports = {
  getOrders,
  getOrder
}