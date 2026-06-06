const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(' Database connected successfully');
  } catch (error) {
    console.error(' Database connection failed:', error.message);
   
  }
}

module.exports = connectDB;
