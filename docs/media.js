const getMedia = {
  tags: ['Media'],
  description: 'The trends managing API',
  operationId: 'Returns the list of all the trends',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string',
    },
  ],
  responses: {
    '200': {
      description: 'User retrieved successfully!'
    },
  },
};

module.exports = {
  getMedia
}