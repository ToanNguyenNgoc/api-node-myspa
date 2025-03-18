const cron = require('node-cron');
const slackController = require('../controllers/slack.controller');

class PushSlackCron {
  constructor() {
    this.job = null;
  }
  instance() {
    if (this.job) {
      console.log('Job is instance!');
      return;
    }
    this.job = cron.schedule(
      '0 9,15 * * *', //Run on 9AM and 3PM
      () => {
        console.log("Run job");
        slackController.remindToGetWater();
      }, {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh"
    });
  }
  schedule(time) {
    return cron.schedule(`${time}`, () => {
      console.log(`Jon run at: ${time}`);
      slackController.remindToGetWater();
    }, {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh"
    });
  }
}

module.exports = PushSlackCron;