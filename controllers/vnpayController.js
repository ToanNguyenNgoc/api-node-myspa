const moment = require('moment');
const sha512 = require("sha256")
// const sortObject = require("sortobject")

const sortObject=(obj)=> {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  
  return sorted;
}

const vnpayController = {
  createPayment: async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let config = require('config');

    // let tmnCode = config.get('vnp_TmnCode');
    // let secretKey = config.get('vnp_HashSecret');
    let tmnCode = "8HRDW3ZS"
    let secretKey = "DXKMSENFLYVYMGLYQIUZPKVDTHCHLBSQ"
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl = "http%3A%2F%2Flocalhost%3A8888%2Forder%2Fvnpay_return";
    let orderId = moment(date).format('DDHHmmss');
    let amount = 10000
    let bankCode = "VNPAYQR"

    let locale = "vn"
    // if (locale === null || locale === '') {
    //   locale = 'vn';
    // }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = "%3A%3A1";
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_BankCode'] = bankCode;

    vnp_Params = sortObject(vnp_Params);
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    res.json({ url: vnpUrl })
  }
}
module.exports = vnpayController