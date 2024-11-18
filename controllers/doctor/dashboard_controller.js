const Doctor = require('../../models/doctor_model');

module.exports.dashboard = async (req, res) => {
  res.render("doctor/pages/dashboard/index", {
    titlePage: "Trang tổng quan",
    doctor: res.locals.doctor
  });
}