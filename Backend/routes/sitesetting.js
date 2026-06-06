const express = require('express');
// const multer = require('multer');
const Router = express.Router();
const {
    getSiteSetting,
    updateSiteSetting
} = require('../controllers/sitesetting');
// const { handleMulterError } = require('../middlewares/multer');
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../Frontend/public/uploads/siteSettings/');
//   },
//   filename: function (req, file, cb) {
    
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 
//   }
// });


Router.get('/getSiteSetting', getSiteSetting);
Router.put('/updateSiteSetting',updateSiteSetting);
module.exports = Router;