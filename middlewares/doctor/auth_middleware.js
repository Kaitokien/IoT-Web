const systemConfig = require('../../config/system');
const Doctor = require('../../models/doctor_model');

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const doctor = await Doctor.findOne({ token: req.cookies.token }).select('-password');
    if (!doctor) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      res.locals.doctor = doctor;
      next();
    }
  }
}