const getFeedbackOrgSocial = {
  tags: ['FeedbackOrgSocials'],
  summary: 'Returns the list of all feedback',
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
  ],
  responses: {
    '200': {
      description: 'The list of the feedback'
    },
  },
}

const postFeedbackOrgSocial = {
  tags: ['FeedbackOrgSocials'],
  summary: 'Post new feedback',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/postFeedbackOrgSocialSchema',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'The new feedback'
    },
  }
}

const postFeedbackOrgSocialSchema = {
  type: 'object',
  properties: {
    org_social_name: {},
    org_social_number: {},
    org_social_email: {},
    org_social_content: {},
    org_social_files: { type: 'array', example: [] },
    recaptcha: {},
  }
}

const deleteFeedbackOrgSocial = {
  tags: ['FeedbackOrgSocials'],
  summary: 'Delete feedback',
  parameters: [
    {
      name: 'id',
      type: 'string',
      in: 'path',
      description: 'The channel Feedback org social ID',
      required: true
    },
  ],
  responses: {
    '200': {
      description: 'Delete feedback'
    },
  },
}

module.exports = {
  getFeedbackOrgSocial,
  postFeedbackOrgSocial, postFeedbackOrgSocialSchema,
  deleteFeedbackOrgSocial
}