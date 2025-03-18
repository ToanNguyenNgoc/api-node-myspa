const cron = require('node-cron');
const slackController = require('../controllers/slack.controller');

class PushSlackCron {
  constructor() {
    this.job = null;
    this.jobs = [];
  }
  instance() {
    if (this.job) {
      console.log('Job is instance!');
      return;
    }
    if (this.jobs?.length) {
      console.log('Jobs is instance!');
      return;
    }
    this.jobs.push(
      this.schedule('0 9 * * *'),
      this.schedule('0 14 * * *')
    );
  }
  schedule(time) {
    return cron.schedule(time, () => {
      console.log(`Jon run at: ${time}`);
      slackController.remindToGetWater();
    }, {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh"
    });
  }
}

module.exports = PushSlackCron;