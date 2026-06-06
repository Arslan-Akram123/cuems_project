const express = require('express');
const router = express.Router();
const axios = require("axios");
const {
  initiatePaymobPayment,
  handlePaymobCallback
} = require('../controllers/paymob');

// ======================
// PAYMOB PAYMENT ROUTES
// ======================

/**
 * @route   POST /api/paymob/initiate
 * @desc    Initiate Paymob payment and return iframe URL
 * @access  Public (or Private with auth middleware)
 */
router.post('/initiate', initiatePaymobPayment);

/**
 * @route   POST /api/paymob/callback
 * @desc    Handle Paymob payment callback (webhook)
 * @access  Public (Paymob servers will call this)
 */
router.post('/callback', handlePaymobCallback);

/**
 * @route   GET /api/paymob/verify/:transactionId
 * @desc    Verify transaction status manually (optional)
 * @access  Private
 * @note    This would require adding verifyTransaction to your controller
 */
// router.get('/verify/:transactionId', verifyTransaction); // Uncomment if implemented

module.exports = router;