const deleteMessage = {
  tags: ['Slacks'],
  summary: '',
  parameters: [
    {
      name: 'id',
      type: 'string',
      in: 'path',
      description: 'The channel ID',
      required: true
    },
  ],
  responses: {
    '200': {
      description: 'Delete message'
    },
  },
}

module.exports = {
  deleteMessage
}