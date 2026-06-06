const express = require('express');

const { bookEvent,getNewBookings,UpdateAdminRead,getSpecificBooking,UpdateConfirmBooking,UpdateCancelBooking,getAllBookings,getAllUserBookings,UpdateUserRead,completeBooking } = require('../controllers/bookevent');
const { compact } = require('lodash');
const Router = express.Router();

Router.post('/bookingEventrequest', bookEvent);
Router.get('/getBooking/:id', getSpecificBooking);
Router.get('/getNewBookings', getNewBookings);
Router.put('/UpdateAdminRead', UpdateAdminRead);
Router.put('/confirmBooking/:id', UpdateConfirmBooking);
Router.put('/cancelBooking/:id', UpdateCancelBooking);
Router.get('/getAllBookings', getAllBookings);
Router.get('/getAllUserBookings', getAllUserBookings);
Router.put('/UpdateUserRead', UpdateUserRead);
Router.post("/complete-booking",completeBooking);
module.exports = Router;