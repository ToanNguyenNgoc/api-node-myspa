const { SePayPgClient } = require('sepay-pg-node');
const axios = require('axios');

const client = new SePayPgClient({
  env: process.env.SEPAY_ENV,
  merchant_id: process.env.SEPAY_MERCHANT_ID,
  secret_key: process.env.SEPAY_SECRET_KEY,
});

const checkoutURL = client.checkout.initCheckoutUrl();

const escapeHtml = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const base64Encode = (s) => {
  return Buffer.from(s).toString('base64')
}

const SepayController = {
  createPayment: (request, response) => {
    const amount = request.body.amount || 2000;
    const orderId = new Date().getTime();
    const fields = client.checkout.initOneTimePaymentFields({
      operation: 'PURCHASE',
      payment_method: 'BANK_TRANSFER',
      order_invoice_number: orderId,
      order_amount: amount,
      currency: 'VND',
      order_description: `Thanh toan don hang DH: ${orderId}`,
      success_url: `https://example.com/order/DH123?payment=success&orderId=${orderId}`,
      error_url: `https://example.com/order/DH123?payment=error&orderId=${orderId}`,
      cancel_url: `https://example.com/order/DH123?payment=cancel&orderId=${orderId}`,
    });
    const inputs = Object.entries(fields)
      .map(([k, v]) => `<input type="hidden" name="${escapeHtml(k)}" value="${escapeHtml(v)}" />`)
      .join("\n");
    response.set("Content-Type", "text/html; charset=utf-8");
    return response.send(`<!doctype html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body>
      <p>Đang chuyển đến trang thanh toán production...</p>
      <form id="sepay_form" method="POST" action="${escapeHtml(checkoutURL)}">
      ${inputs}
      <noscript><button type="submit">Tiếp tục</button></noscript>
      </form>
      <script>document.getElementById('sepay_form').submit();</script>
      </body>
      </html>`);
  },

  ipnPayment: (request, response) => {
    console.log(request.body);
    return response.json({ data: 'OK' });
  },

  /**
   * Use order_invoice_number to call detail
  */
  getOrderDetail: async (request, response) => {
    try {
      const { orderId } = request.params;
      if (!orderId) return response.status(404).json({ data: null, message: 'orderId required' });
      const basicAuth = base64Encode(`${process.env.SEPAY_MERCHANT_ID}:${process.env.SEPAY_SECRET_KEY}`);
      const responseOrder = await axios.get(`${process.env.SEPAY_URL}/v1/order/detail/${orderId}`, {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        }
      });
      return response.json(responseOrder.data);
    } catch (error) {
      return response.status(error.response?.status || 500).json(error.response?.data || {});
    }
  }
}

module.exports = SepayController;