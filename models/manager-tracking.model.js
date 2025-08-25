const mongoose = require('mongoose');

const managerTrackingScheme = mongoose.Schema({
  subdomain: { type: String, required: false },
  api_url: { type: String, required: false },
  header: { type: String, required: false },
  ip_address: { type: String, required: false },
  ip_device: { type: String, required: false },
  device: { type: String, required: false },
  screen: { type: String, required: false },
  method: { type: String, required: false },
  payload: { type: String, required: false },
  type: { type: String, required: false, default: 'API' }, //type: API | WEBVIEW
}, {
  timestamps: true
});

const ManagerTrackingModel = mongoose.model("ManagerTracking", managerTrackingScheme);

module.exports = ManagerTrackingModel;