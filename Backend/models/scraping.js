const mongoose = require("mongoose");

const ScrappedEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
  title: {
    type: String,
    required: false,
    trim: true
  },
  link: {
    type: String,
    required: false,
    trim: true
  },
  date: {
    type: String, 
    required: false
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ScrappedEvent = mongoose.model("ScrappedEvent", ScrappedEventSchema);
module.exports = ScrappedEvent;
