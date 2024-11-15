const Patient = require('../../models/patient_model');

module.exports.infoPatient = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const patient = await Patient.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false
    }).select('-password');

    if(patient) {
      res.locals.patient = patient;
    }
  } 
  next();
}