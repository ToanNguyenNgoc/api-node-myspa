const uploadMedia = {
  tags: ['Upload'],
  summary: 'Upload media',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
              nullable: true
            }
          }
        }
      }
    }
  },
  responses: {
    '200': { description: 'Return new media' }
  }
}
const uploadMultipleMedia = {
  tags: ['Upload'],
  summary: 'Upload multiple media',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
                nullable: true
              }
            }
          }
        }
      }
    }
  },
  responses: {
    '200': { description: 'Return list of media' }
  }
}
const uploadMediaCloudinary = {
  tags: ['Upload'],
  summary: 'Upload media to cloudinary',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
              nullable: true
            }
          }
        }
      }
    }
  },
  responses: {
    '200': { description: 'Return new media' }
  }
}

module.exports = { uploadMedia, uploadMultipleMedia, uploadMediaCloudinary }