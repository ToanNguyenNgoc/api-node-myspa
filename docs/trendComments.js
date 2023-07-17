const getTrendComments = {
  tags: ['TrendComments'],
  summary: 'Return the list of comment by trend id',
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
      name: 'filter[trend]',
      in: 'query',
      type: 'number',
      required: true,
      description: 'Get list of the comments by trend id'
    }
  ],
  responses: {
    '200': {
      description: 'Return the list of comment by trend id'
    },
  }
}
module.exports = {
  getTrendComments
}