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
        this.onSendMessageToTopic(payload);
      })
      //
      socket.on(Events.TYPING, (payload) => {
        this.onTyping(payload)
      })
    })
  }
  /**
   * @param {User} user
   * @param {any} typing
   */
  async onJoinAllTopic(user, topic_ids = [], socket) {
    const { id, fullname, telephone, avatar } = user;
    this.user = { id, fullname, telephone, avatar };
    console.log(`User: ${JSON.stringify(this.user)} start join all topic`)
    topic_ids.forEach(topic_id => {
      console.log("Joined topic_id: ", `CHANNEL.${topic_id}`);
      socket.join(`CHANNEL.${topic_id}`);
    })
  }
  /**
   * @typedef {Object} MessagePayload
   * @property {number} msg
   * @property {string} topic_id
   * @property {number[]} [media_ids]
   * @property {string[]} [media_urls]
   */
  /**
   * @param {MessagePayload} message
   */
  async onSendMessageToTopic(message) {
    const newMsg = Object.assign(message, { user: this.user }, {
      _id: new Date().getTime().toString(),
      user_id: this.user.id,
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
   * @param {TypingPayload} typing
   */
  async onTyping(typing) {
    this._io.to(`CHANNEL.${typing.topic_id}`).emit(Events.TYPING, Object.assign(typing, { user: this.user }));
  }
}

module.exports = ApiMyspaSocket;