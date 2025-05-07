const moment = require('moment');
const admin = require('firebase-admin');
const ApiMyspaService = require('../services/api.myspa.service');
const axios = require('axios');

const Events = {
  SUB: 'SUB',
  SUB_TOPIC: 'SUB_TOPIC',
  SUB_CHAT_TOPIC: 'SUB_CHAT_TOPIC',
  SEND_MSG: 'SEND_MSG',
  LISTENER_MSG: 'LISTENER_MSG',
  LISTENER_MSG_ORG: 'LISTENER_MSG_ORG',
  TYPING: 'TYPING'
}

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} fullname
 * @property {string} telephone
 * @property {string} avatar
 * @property {string} org_id
 */
/**
 * @typedef {Object} MessagePayload
 * @property {number} msg
 * @property {string} topic_id
 * @property {number[]} [media_ids]
 * @property {string[]} [media_urls]
 * @property {string} org_id
 */
/**
 * @property {string[]} user_ids
 */

class ApiMyspaSocket {
  constructor(io) {
    this._io = io
  }
  async onConnect() {
    if (!this._io) return;
    this._io.on('connect', (socket) => {
      //
      console.log(`${socket.id} connected`)
      socket.on(Events.SUB, (payload) => {
        if (!payload.user) return console.log("User is required");
        this.onJoinAllTopic(payload.user, payload.topic_ids, socket);
      })
      //
      socket.on(Events.SUB_TOPIC, (payload) => {
        this.onSubscribeTopic({
          user: payload.user,
          topic_id: payload.topic_id,
          socket
        })
      })
      //
      socket.on(Events.SUB_CHAT_TOPIC, (payload) => {
        console.l
        ApiMyspaService.setUserIsSubscribeChatTopic({
          user: payload.user,
          topic_id: payload.topic?.topic_id,
          isSubscribing: payload.topic?.isSubscribing
        })
      })
      //
      socket.on(Events.SEND_MSG, (payload) => {
        this.onSendMessageToTopic({
          user: payload.user,
          message: payload.message,
          user_ids: payload.user_ids || []
        });
      })
      //
      socket.on(Events.TYPING, (payload) => {
        this.onTyping({
          user: payload.user,
          typing: payload.typing
        })
      })
      //
      // socket.on("disconnect", (reason) => {
      //   console.log(`${socket.id} disconnected`)
      // });
    })
  }
  onDisconnect() {
    return console.log("Disconnect !")
    console.log(`Socket ${socket.id} disconnected. Reason: ${user.fullname}`);
  }
  /**
   * @param {User} user
   * @param {any} typing
   */
  async onJoinAllTopic(user, topic_ids = [], socket) {
    console.log(`User: ${JSON.stringify(user)} start join all topic`)
    topic_ids.forEach(topic_id => {
      console.log("Joined topic_id: ", `CHANNEL.${topic_id}`);
      socket.join(`CHANNEL.${topic_id}`);
    });
    if (user.org_id) {
      console.log(`Joined CI_ORG.${user.org_id}`);
      socket.join(`CI_ORG.${user.org_id}`)
    }
  }

  /**
  * @param {{ user: User, topic_id: string, socket:any }} params
  */
  async onSubscribeTopic({ user, topic_id, socket }) {
    return socket.join(`CHANNEL.${topic_id}`);
  }

  /**
  * @param {{ user: User, message: MessagePayload, user_ids: string[] }} params
  */
  async onSendMessageToTopic({ user, message, user_ids }) {
    const newMsg = Object.assign(message, { user }, {
      _id: new Date().getTime().toString(),
      user_id: user.id,
      reply_id: null,
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    })
    console.log(`Send a message to: CHANNEL.${message.topic_id}`)
    this._io.to(`CHANNEL.${message.topic_id}`).emit(Events.LISTENER_MSG, newMsg);
    if (message.org_id) {
      console.log(`Send a message to: CI_ORG.${message.org_id}`)
      this._io.to(`CI_ORG.${message.org_id}`).emit(Events.LISTENER_MSG_ORG, newMsg);
    }
    this.pushMessageNotification({ user, message, user_ids });
    return;
  }

  /**
   * @typedef {Object} TypingPayload
   * @property {boolean} typing
   * @property {string} topic_id
   */
  /**
* @param {{ user: User, typing: TypingPayload }} params
*/
  async onTyping({ user, typing }) {
    this._io.to(`CHANNEL.${typing.topic_id}`).emit(Events.TYPING, Object.assign(typing, { user }));
  }
  //Push message notification
  async pushMessageNotification({ user, message: messageData, user_ids }) {
    console.log(messageData.topic_id);
    try {
      let message = {
        notification: {
          title: user?.fullname || 'Tin nhắn',
          body: messageData.media_urls?.length > 0 ? 'Đã gửi hình ảnh' : messageData?.msg,
        },
        data: { type: "20", payload_id: messageData.topic_id },
        topic: ''
      };
      user_ids.forEach(async (user_id) => {
        if (!await ApiMyspaService.onCheckUserIsSubscribeChatTopic({ user_id, topic_id: messageData.topic_id })) {
          //Check user is opening chat, not push notification
          message.topic = `com.myspa.beautyx..user_${user_id}`
          admin.messaging().send(message).then(() => console.log(`com.myspa.beautyx..user_${user_id}`)).catch(() => { });
        }
      })
      if (user_ids.length === 0) {
        if (!await ApiMyspaService.onCheckUserIsSubscribeChatTopic({ user_id, topic_id: messageData.topic_id })) {
          axios.post(process.env.API_PUSH_NOTIFICATION_MANAGER, {
            "msg": messageData?.msg,
            "fullname": user?.fullname,
            "topic_id": messageData.topic_id,
            "media_ids": messageData.media_urls,
            "media_urls": messageData.media_urls,
            "org_id": messageData.org_id
          })
            .then(() => console.log(`Send notification org_id = ${messageData.org_id}`))
            .catch(() => console.log(`Failed notification org_id = ${messageData.org_id}`))
        }
      }
    } catch (error) {
      console.log(error)
    }
    return;
  }
}

module.exports = ApiMyspaSocket;