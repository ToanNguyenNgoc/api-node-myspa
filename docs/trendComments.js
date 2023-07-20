const getTrendComments = {
  tags: ['Tiktok'],
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
const getRefreshTrend = {
  tags: ['Tiktok'],
  summary: 'Refresh trend by trend id',
  parameters: [
    {
      name: 'id',
      type: 'integer',
      in: 'path',
      description: 'The trend id',
      required: true
    },
  ],
  responses: {
    '200': {
      description: 'Return trend by trend id'
    },
  }
}
module.exports = {
  getTrendComments, getRefreshTrend
}