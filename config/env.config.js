const dotenv = require('dotenv');
dotenv.config();

const config = {
  slack: {
    SLACK_API_URL: process.env.SLACK_API_URL || '',
    SLACK_CHANEL: process.env.SLACK_CHANEL || '',
    SLACK_MEMBER_ID: process.env.SLACK_MEMBER_ID || '',
    SLACK_AUTH_BEARER: process.env.SLACK_AUTH_BEARER || '',
    SLACK_API_BOT_ID: process.env.SLACK_API_BOT_ID || ''
  }
}

module.exports = config;