const express=require('express');

const router=express.Router();

const {getsepcificEvents,globalSearchTitle,comparativeEventsSearch}=require('../controllers/scraping');

router.get('/getsepcificEvents/:uniname',getsepcificEvents);
router.get('/globalSearchTitle',globalSearchTitle);
router.get('/comparativeEventsSearch/:eventname',comparativeEventsSearch);

module.exports=router