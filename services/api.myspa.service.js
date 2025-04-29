const UserInChat = require('../models/userInChat.model');

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} fullname
 * @property {string} telephone
 * @property {string} avatar
 * @property {string} org_id
 */

const ApiMyspaService = {
  setStatus: async (socket_id, user, status = false) => {

  },
  /**
  * @param {{ user: User, topic_id:string, isSubscribing:boolean }} params
  */
  setUserIsSubscribeChatTopic: async ({ user, topic_id, isSubscribing }) => {
    try {
      if (isSubscribing) {
        const newUserInChat = new UserInChat({
          user_id: user.id,
          topic_id: topic_id
        });
        await newUserInChat.save();
      } else {
        await UserInChat.deleteMany({
          user_id: user.id,
          topic_id: topic_id
        })
      }
    } catch (error) {
      console.log(`Error: setUserIsSubscribeChatTopic: ${user, topic_id, isSubscribing}`)
    }
  },
  /**
  * @param {{ user: User, topic_id:string}} params
  */
  onCheckUserIsSubscribeChatTopic: async ({ user_id, topic_id }) => {
    const response = await UserInChat.findOne({
      user_id: user_id,
      topic_id: topic_id
    })
    return response
  }
}

module.exports = ApiMyspaService;