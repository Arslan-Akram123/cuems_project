const express = require('express');
const router = express.Router();
const {createContactUs} = require('../controllers/contactus');

router.post('/createContactUs',createContactUs);

module.exports = router;