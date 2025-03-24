const cron = require('node-cron');
const slackController = require('../controllers/slack.controller');

class PushSlackCron {
  constructor() {
    this.jobs = [];
    this.defaultJob = null;
    this.defaultJobDelete = null;
  }

  instance() {
    if (this.defaultJob) {
      console.log('Default job already exists!');
      return;
    }
    this.defaultJob = cron.schedule(
      '0 9,15 * * *',
      () => {
        console.log("Running default job (9AM & 3PM)");
        slackController.remindToGetWater();
      }, {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh"
    });
    console.log('Default job scheduled at 9:00 and 15:00');
    this.deleteMessage();
  }
  deleteMessage(){
    if (this.defaultJobDelete) {
      console.log('Default delete job already exists!');
      return;
    }
    this.defaultJob = cron.schedule(
      '5 9,15 * * *',
      () => {
        console.log("Running default job (9:05AM & 3:05PM)");
        slackController.deleteMessageChannel();
      }, {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh"
    });
    console.log('Default job scheduled delete at 9:05 and 15:05');
  }

  schedule(time) {
    if (this.jobs.find(job => job.time === time)) {
      console.log(`Job at ${time} already scheduled!`);
      return;
    }
    const job = cron.schedule(`${time}`, () => {
      console.log(`Job run at: ${time}`);
      slackController.remindToGetWater();
    }, {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh"
    });

    this.jobs.push({ time, job });
    console.log(`New job scheduled at: ${time}`);
  }
}

module.exports = PushSlackCron;
