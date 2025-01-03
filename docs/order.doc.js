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

module.exports = {
  getOrders
}