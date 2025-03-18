const PushSlackCron = require('./cron/push-slack.cron');

const pushSlackCron = new PushSlackCron();
pushSlackCron.instance();
// pushSlackCron.schedule('51 14 * * *')