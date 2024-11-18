const mongoose = require('mongoose');
const generate = require('../helpers/generate');

const doctorSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  email: String,
  address: String,
  password: String,
  age: Number,
  gender: String,
  token: {
    type: String,
    default: generate.generateRandomString(20)
  },
}, { 
  timestamps: true
});

const Doctor = mongoose.model("Doctor", doctorSchema, "doctor")

module.exports = Doctor;