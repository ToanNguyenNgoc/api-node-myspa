const getHistoryView = {
  tags: ['History'],
  summary: 'Returns the list of history view by user',
  security: [
    {
      bearerAuth: [],
    },
  ],
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
    }
  ],
  responses: {
    '200': { description: 'The list of the history' }
  }
}

module.exports = {
  getHistoryView
}