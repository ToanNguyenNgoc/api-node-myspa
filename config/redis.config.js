const { createClient } = require('redis');

class RedisConfig {
  constructor() {
    if (!RedisConfig.instance) {
      this.redisClient = createClient({
        url: process.env.REDIS_CONNECT || 'redis://localhost:6379',
      });
      this.isConnected = false;
      this.redisClient.on('error', (err) => {
        console.error('❌ Redis Client Error:', err);
      });
      RedisConfig.instance = this;
    }
    return RedisConfig.instance;
  }
  async onConnect() {
    if (!this.isConnected) {
      await this.redisClient.connect();
      this.isConnected = true;
      console.log('✅ Redis connected');
    }
  }
  /**
  * @param {{ key: string, data:any}} params
  */
  async setData({ key, data }) {
    if (!this.isConnected) await this.onConnect();
    await this.redisClient.set(key, JSON.stringify(data))
  }
  /**
  * @param {{ key: string}} params
  */
  async getData({ key }) {
    let data;
    if (!this.isConnected) await this.onConnect();
    const value = await this.redisClient.get(key);
    if (!value) return null;
    try {
      data = JSON.parse(value);
    } catch (error) { }
    return data
  }
  /**
   * @param {string} key
   */
  async deleteData(key) {
    if (!this.isConnected) await this.connect();
    try {
      const result = await this.redisClient.del(key);
      if (result === 1) {
        console.log(`🗑️ Key "${key}" deleted`);
        return true;
      } else {
        console.warn(`⚠️ Key "${key}" not exist`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error while delete "${key}":`, error);
      return false;
    }
  }
  async clearAll() {
    if (!this.isConnected) await this.connect();
    try {
      await this.redisClient.flushDb();
      console.log('🧹 Delete all data in Redis');
    } catch (error) {
      console.error('❌ Error delete all data Redis:', error);
    }
  }
}
const RedisClient = new RedisConfig();
module.exports = RedisClient;
