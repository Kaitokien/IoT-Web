const mongoose = require('mongoose');
const generate = require('../helpers/generate');

const vitalSignSchema = new mongoose.Schema({
  bodyTemperature: Number,
  heartRate: Number,
  timestamp: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  username: String,
  password: String,
  age: Number,
  gender: String,
  tokenUser: {
    type: String,
    default: generate.generateRandomString(20)
  },
  measurement: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Measurement"
    }
  ],
  status: {
    type: String,
    enum: ['Stable', 'Critical', 'Needs Attention'],
    default: 'Stable'
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Patient = mongoose.model("Patient", patientSchema, "patient")

module.exports = Patient;