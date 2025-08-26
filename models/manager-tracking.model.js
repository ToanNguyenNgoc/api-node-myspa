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
  type: { type: String, required: false, default: 'API' },
  manager_tracking_url_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ManagerTrackingUrl'
  },
}, {
  timestamps: true
});

const ManagerTrackingModel = mongoose.model("ManagerTracking", managerTrackingScheme);

const managerTrackingUrlSchema = mongoose.Schema({
  url: { type: String, required: false },
});

const ManagerTrackingUrlModel = mongoose.model("ManagerTrackingUrl", managerTrackingUrlSchema);

module.exports = {
  ManagerTrackingUrlModel,
  ManagerTrackingModel,
};