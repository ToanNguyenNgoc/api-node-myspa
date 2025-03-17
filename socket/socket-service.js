const http = require('http');
const express = require('express');
const app = express();
const { Server } = require("socket.io");

class SocketService {
  static server = http.createServer(app);
  static io = new Server(this.server);
  constructor() { }

  static instance(port) {
    this.io.on('connection', (socket) => {
      console.log('a user connected', socket.id);
    });
    this.server.listen(port, () => {
      console.log(`Socket server running on port ${port}`);
    });
    return
  }

}

module.exports = SocketService