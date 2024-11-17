const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  email: String,
  address: String,
  password: String,
  age: Number,
  gender: String
}, { 
  timestamps: true
});

const Doctor = mongoose.model("Doctor", doctorSchema, "doctor")

module.exports = Doctor;