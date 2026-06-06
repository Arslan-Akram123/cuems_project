const express = require('express');
const router = express.Router();
const { addNotice, getNotices, notificationOfUser, markNoticeAsRead } = require('../controllers/notice');

router.post('/addNotice', addNotice);
router.get('/getNotices', getNotices);
router.get('/getNotificationOfUSer', notificationOfUser);
router.post('/markAsRead', markNoticeAsRead);

module.exports = router;