const Patient = require('../../models/patient_model');

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
  } else {
    const patient = await Patient.findOne({ 
      tokenUser: req.cookies.tokenUser 
    }).select('-password');
    if (!patient) {
      res.redirect(`/user/login`);
    } else {
      res.locals.patient = patient;
      next();
    }
  }
}