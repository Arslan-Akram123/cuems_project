const axios = require("axios");
const CryptoJS = require("crypto-js");

// Paymob Test Credentials
const PAYMOB_API_KEY = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRFeE1UY3NJbTVoYldVaU9pSXhOelUxTkRZME9URTNMamcyTXpBek9TSjkuSnk4SUkycldRMVExWnMzdEltWTdqNl9FQzFjbzV5LWdUcHJfTzFZUHlaaGdYQWdlX1Zmb1RVUGRRRWhBMHZMYjROOUtUNlhQZldDMTNkSEV3MzNkRVE="
const PAYMOB_HMAC_KEY = "7FCBC4F89F9DDFFAECA81ACEED3678CF";
const PAYMOB_IFRAME_ID = "9973";

// Authentication function
async function authenticatePaymob() {
  const response = await axios.post(
    "https://accept.paymobsandbox.com/api/auth/tokens",
    { api_key: PAYMOB_API_KEY }
  );
  return response.data.token;
}

// Order registration function
async function registerOrder(token, amount, bookingId) {
  const order = await axios.post(
    "https://accept.paymobsandbox.com/api/ecommerce/orders",
    {
      auth_token: token,
      delivery_needed: false,
      amount_cents: amount * 100,
      currency: "EGP",
      items: [],
      merchant_order_id: bookingId,
    }
  );
  console.log("Order registered:", order.data);
  return order.data.id;
}

// Payment key generation function
async function generatePaymentKey(token, orderId, userData) {
  const paymentKey = await axios.post(
    "https://accept.paymobsandbox.com/api/acceptance/payment_keys",
    {
      auth_token: token,
      amount_cents: userData.amount * 100,
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone_number: userData.phone,
      },
      currency: "EGP",
      integration_id: PAYMOB_IFRAME_ID,
    }
  );
  return paymentKey.data.token;
}

// HMAC verification function
function verifyPaymobCallback(obj, hmac) {
  const sorted = Object.keys(obj).sort();
  let concatenated = "";
  for (const key of sorted) {
    concatenated += obj[key];
  }
  const calculatedHmac = CryptoJS.HmacSHA256(concatenated, PAYMOB_HMAC_KEY).toString();
  return hmac === calculatedHmac;
}

// Payment initiation controller
async function initiatePaymobPayment(req, res) {
    console.log("Initiating Paymob payment with data:", req.body);
  try {
    const { amount, bookingId, userData } = req.body;
    
    const token = await authenticatePaymob();
    const orderId = await registerOrder(token, amount, bookingId);
    console.log("Order registered with ID:", orderId);
    const paymentKey = await generatePaymentKey(token, orderId, userData);
    console.log("Payment key generated:", paymentKey);
    res.json({
      url: `https://accept.paymobsandbox.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Paymob payment failed" });
  }
}

// Callback handler controller
async function handlePaymobCallback(req, res) {
  const { obj, hmac } = req.body;
  
  if (!verifyPaymobCallback(obj, hmac)) {
    return res.status(400).json({ error: "Invalid callback" });
  }
  
  if (obj.success === "true") {
    console.log("Payment succeeded:", obj);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: "Payment failed" });
  }
}

// Export all functions
module.exports = {
  authenticatePaymob,
  registerOrder,
  generatePaymentKey,
  verifyPaymobCallback,
  initiatePaymobPayment,
  handlePaymobCallback
};