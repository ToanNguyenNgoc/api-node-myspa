const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  is_demo: { type: Boolean, required: false },
  is_read: { type: Boolean, required: false, default: false },
  user_telephone: { type: String, required: false },
  user_name: { type: String, require: false },
  user_payment_amount: { type: String, require: false },
  user_order_id: { type: Number, required: false },
  platform: { type: String, require: false },
  order: { type: String, required: true },
}, { timestamps: true });

const notificationAdminSchema = mongoose.Schema({
  telephone: { type: String, required: true },
  device_token: { type: String, required: true },
})

const Notification = mongoose.model("Notification", notificationSchema);
const NotificationAdmin = mongoose.model("NotificationAdmin", notificationAdminSchema);
module.exports = {
  Notification,
  NotificationAdmin
}
