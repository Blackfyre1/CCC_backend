
const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema({
    userId: {
      type: String,
      unique: true,
      required: true
    },
    lat: {
      required: true,
      type: String
    },
    long: {
      required: true,
      type: String
    },
    color: {
      type: String,
    }
  })

const Location = mongoose.model('Location',locationSchema);
module.exports = Location
