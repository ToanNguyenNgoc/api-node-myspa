const moment = require('moment');

const Events = {
  SUB: 'SUB',
  SEND_MSG: 'SEND_MSG',
  LISTENER_MSG: 'LISTENER_MSG',
  TYPING: 'TYPING'
}

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} fullname
 * @property {string} telephone
 * @property {string} avatar
 */
/**
 * @typedef {Object} MessagePayload
 * @property {number} msg
 * @property {string} topic_id
 * @property {number[]} [media_ids]
 * @property {string[]} [media_urls]
 */

class ApiMyspaSocket {
  constructor(io) {
    this._io = io
  }
  async onConnect() {
    if (!this._io) return;
    this._io.on('connect', (socket) => {
      //
      socket.on(Events.SUB, (payload) => {
        if (!payload.user) return console.log("User is required");
        this.onJoinAllTopic(payload.user, payload.topic_ids, socket);
      })
      //
      socket.on(Events.SEND_MSG, (payload) => {
        this.onSendMessageToTopic({
          user: payload.user,
          message: payload.message
        });
      })
      //
      socket.on(Events.TYPING, (payload) => {
        this.onTyping({
          user: payload.user,
          typing: payload.typing
        })
      })
    })
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
    })
  }
  /**
 * @param {{ user: User, message: MessagePayload }} params
 */
  async onSendMessageToTopic({ user, message }) {
    const newMsg = Object.assign(message, { user }, {
      _id: new Date().getTime().toString(),
      user_id: user.id,
      reply_id: null,
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    })
    console.log(`Send a message to: CHANNEL.${message.topic_id}`)
    this._io.to(`CHANNEL.${message.topic_id}`).emit(Events.LISTENER_MSG, newMsg);
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
}

module.exports = ApiMyspaSocket;