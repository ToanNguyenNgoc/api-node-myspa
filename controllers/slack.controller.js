const axios = require('axios');
const config = require('../config/env.config');
const {
  SLACK_API_URL,
  SLACK_CHANEL,
  SLACK_MEMBER_ID,
  SLACK_AUTH_BEARER,
  SLACK_API_BOT_ID
} = config.slack;

const slackController = {
  deleteBotMessage: async (req, res) => {
    await slackController.deleteMessageChannel(req.params.id);
    res.status(200).json({ message: 'Delete all success' });
  },
  deleteMessageChannel: async (channelID = SLACK_CHANEL) => {
    try {
      const messages = await axios.get(`${SLACK_API_URL}/conversations.history?channel=${channelID}`, {
        headers: {
          Authorization: `Bearer ${SLACK_AUTH_BEARER}`
        }
      }).then(res => res.data.messages.filter(i => i.bot_id == SLACK_API_BOT_ID));
      messages.forEach(async (item) => {
        await axios.post(`${SLACK_API_URL}/chat.delete`, {
          channel: channelID,
          ts: item.ts
        }, {
          headers: {
            Authorization: `Bearer ${SLACK_AUTH_BEARER}`
          }
        })
      })
    } catch (error) {
      console.log(error);
    }
    return;
  },
  remindToGetWater: async () => {
    try {
      axios.post(`${SLACK_API_URL}/chat.postMessage`,
        {
          channel: `${SLACK_CHANEL}`,
          text: `Đến giờ uống nước rồi.<!channel> đi lấy nước đi nào ✊🥃 !`,
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