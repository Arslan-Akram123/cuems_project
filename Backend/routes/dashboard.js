const express = require('express');
const { getDashboardData } = require('../controllers/dashboard');
const Router = express.Router();


Router.get('/getDashboardData', getDashboardData);

module.exports = Router;