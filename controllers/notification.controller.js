const { Notification, NotificationAdmin } = require("../models/notification.model");
const { formatPrice } = require("../functions/utils");
const admin = require('firebase-admin');

const telephonesAdmin = process.env.TELEPHONES_ADMIN ? process.env.TELEPHONES_ADMIN.split(',') : []

const notificationController = {
  getAdmins: (req, res) => {
    return res.status(200).json({
      data: {
        data: telephonesAdmin.map(i => ({ telephone: i })),
        current_page: 1,
        per_page: 15,
        total: telephonesAdmin.length,
        total_page: 1
      }
    })
  },
  subscribe: async (req, res) => {
    if (!telephonesAdmin.includes(req.body.telephone)) {
      return res.status(403).json({ status: false, data: { message: "This account is not subscribe notification admin!" } })
    }
    try {
      const notificationAdminPrev = await NotificationAdmin.findOne({
        telephone: req.body.telephone,
        device_token: req.body.device_token
      });
      if (notificationAdminPrev) {
        return res.status(200).json({
          status: true, data: {
            response: notificationAdminPrev,
            message: "Subscribe notification admin!"
          }
        })
      }
      const notificationAdmin = new NotificationAdmin(req.body);
      const response = await notificationAdmin.save();
      return res.status(200).json({ status: true, data: { response, message: "Subscribe notification admin!" } })
    } catch (error) {
      return res.json({ status: false, message: 'Server error' })
    }
  },
  post: async (req, res) => {
    const { order } = req.body
    let message = {
      notification: {
        title: 'Có đơn hàng thanh toán mới',
        body: `Thanh đơn hàng ${formatPrice(order?.payment_gateway?.amount || 0)}đ từ ${order?.user?.fullname || 'Khách'} qua nền tảng ${order?.platform}`,
      },
      data: { type: '35' }
    };
    const device_tokens = await NotificationAdmin.find();
    for (var i = 0; i < device_tokens.length; i++) {
      message.token = device_tokens[i].device_token
      admin.messaging().send(message)
        .then((response) => {
          console.log('Successfully sent message:', response);
        })
        .catch(async (error) => {
          console.log('Error sending message:', error);
        });
    }
    //Log order
    try {
      const logOrder = new Notification({
        is_demo: order?.organization?.subdomain == 'demo',
        user_telephone: order?.user?.telephone,
        user_name: order?.user?.fullname,
        user_payment_amount: order?.payment_gateway?.amount,
        user_order_id: order?.id,
        platform: order?.platform,
        order: JSON.stringify(order)
      })
      const response = await logOrder.save();
      return res.status(200).json({ data: response })
    } catch (error) {
      return res.json({ status: false, message: 'Server error' })
    }
  }
}

module.exports = notificationController