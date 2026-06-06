const express=require('express');
// const multer = require('multer');
const {addUniversity,getAllUniversities,updateUniversity,deleteUniversity,getUniversityById}=require('../controllers/universities');
// const {handleMulterError}=require('../middlewares/multer');
const Router=express.Router();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../Frontend/public/uploads/universities/');
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
Router.post('/addUniversity',addUniversity);
Router.get('/getUniversities',getAllUniversities);
Router.get('/getUniversity/:id',getUniversityById);
Router.put('/updateUniversity/:id',updateUniversity);
Router.delete('/deleteUniversity/:id',deleteUniversity);

module.exports=Router