const express =require('express');
// const multer = require('multer');
const {createEvent,getAllEvents,getSpecificEvent,deleteEvent,updateEvent,getSpecificEventbyCategory}=require('../controllers/events');
// const {handleMulterError}=require('../middlewares/multer');
const Router=express.Router();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../Frontend/public/uploads/events/');
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


Router.post('/createEvent',createEvent);
Router.get('/getAllEvents',getAllEvents);
Router.get('/getEvent/:id',getSpecificEvent);
Router.get('/getEventsByCategory/:id',getSpecificEventbyCategory);
Router.put('/updateEvent/:id',updateEvent);
Router.delete('/deleteEvent/:id',deleteEvent);

module.exports=Router