const axios = require('axios');
const config = require('../config/env.config');
const {
  SLACK_API_URL,
  SLACK_CHANEL,
  SLACK_MEMBER_ID,
  SLACK_AUTH_BEARER
} = config.slack;

const slackController = {
  remindToGetWater: async () => {
    try {
      axios.post(`${SLACK_API_URL}/chat.postMessage`,
        {
          channel: `${SLACK_CHANEL}`,
          text: `Đến giờ uống nước rồi. Bạn <@${SLACK_MEMBER_ID}> đi lấy nước giúp mọi người nào <!channel> ✊🥃 !`,
          // text:'1',
          username: 'Bot Healthy 🤗'
        },
        {
          headers: {
            Authorization: `Bearer ${SLACK_AUTH_BEARER}`
          }
        }
      )
    } catch (error) { }
    return;
  }
}

module.exports = slackController;