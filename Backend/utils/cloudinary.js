const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDY_NAME,
  api_key: process.env.CLOUDY_API_KEY,
  api_secret: process.env.CLOUDY_API_SECRET,
});

module.exports = cloudinary;