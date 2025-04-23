const axios = require('axios');

const Events = {
  SEND_MSG: 'SEND_MSG',
  LISTENER_MSG: 'LISTENER_MSG',
  TYPING: 'TYPING'
}

class ChatSocket {
  constructor(io) {
    this._io = io;
    this._API_URL = process.env.PAR_API_URL;
  }
  onRequestAPI(bearerToken) {
    const request = axios.create({
      baseURL: this._API_URL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': bearerToken
      },
    });
    return request;
  }
  async onConnect() {
    if (!this._io) return;
    this._io.on('connect', async (socket) => {
      const bearerToken = socket.handshake.headers.authorization;
      const user = await this.onAuth(bearerToken);
      if (!user) return console.log("Authenticate Failed !");
      console.log('a user connected name, id', user?.id, user?.fullname);
      await this.onJoinAllTopic(bearerToken, socket);
      // Client send message to server
      socket.on(Events.SEND_MSG, async (payload) => {
        this.onSendMessageToTopic(bearerToken, payload);
      })
      socket.on(Events.TYPING, async (payload) => {
        this.onTyping(user, payload)
      })
    })
  }
  async onAuth(token) {
    let user;
    try {
      const response = await this.onRequestAPI(token).get('/v1/users/profile')
      user = response.data.context;
    } catch (error) { 
      console.log(error.response)
    }
    return user
  }
  async onJoinAllTopic(bearerToken, socket) {
    try {
      const response = await this.onRequestAPI(bearerToken).get('/v1/topics?p=1&l=100&sort=-updated_at');
      const topic_ids = response.data.context.data.map(i => i._id);
      topic_ids.forEach(_id => {
        console.log("Joined topic_id: ", `CHANNEL.${_id}`);
        socket.join(`CHANNEL.${_id}`);
      });
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * @typedef {Object} MessagePayload
   * @property {number} msg
   * @property {string} topic_id
   * @property {number[]} [media_ids]
   */
  /**
   * @param {string} bearerToken
   * @param {MessagePayload} message
   */
  async onSendMessageToTopic(bearerToken, message) {
    try {
      const response = await this.onRequestAPI(bearerToken).post('/v1/messages', message);
      this._io.to(`CHANNEL.${message.topic_id}`).emit(Events.LISTENER_MSG, response.data.context);
    } catch (error) { }
    return;
  }
  /**
   * @typedef {Object} TypingPayload
   * @property {boolean} typing
   * @property {string} topic_id
   */
  /**
   * @param {any} user
   * @param {TypingPayload} typing
   */
  async onTyping(user, typing) {
    this._io.to(`CHANNEL.${typing.topic_id}`).emit(Events.TYPING, Object.assign(typing, {
      avatar: user.avatar,
      fullname: user.fullname,
      email: user.email
    }));
  }
}

module.exports = ChatSocket