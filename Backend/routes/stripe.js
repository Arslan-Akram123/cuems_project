const express = require('express');
const router = express.Router();
const { createPaymentIntent,getAllPayments } = require('../controllers/stripe');

router.post('/create-payment-intent',createPaymentIntent);
router.get('/getAllPayments',getAllPayments);

module.exports = router;