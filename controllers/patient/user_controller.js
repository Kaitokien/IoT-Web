const Patient = require("../../models/patient_model");
const SensorData = require("../../models/SensorData");
const Measurement = require("../../models/Measurement");
//[GET] /login
module.exports.login = (req, res) => {
  res.render("patient/pages/user/login");
};

// [GET] /register
module.exports.register = (req, res) => {
  res.render("patient/pages/user/register");
};

// [POST] /register
module.exports.registerPost = async (req, res) => {
  console.log(req.body);
  const existEmail = await Patient.findOne({
    email: req.body.email,
  });
  const existUsername = await Patient.findOne({
    username: req.body.username,
  });
  if (existEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  } else if (existUsername) {
    req.flash("error", "Tên người dùng đã tồn tại!");
    res.redirect("back");
    return;
  } else {
    // req.body.password = md5(req.body.password);
    const patient = new Patient(req.body);
    await patient.save();
    res.cookie("tokenUser", patient.tokenUser);
    res.redirect("/user/welcome");
  }
};

// [POST] /login
module.exports.loginPost = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const patient = await Patient.findOne({
    username: username,
    deleted: false,
  });

  if (!patient) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
  } else if (password !== patient.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
  } else {
    global.userId = patient._id;
    console.log(global.userId);
    res.cookie("tokenUser", patient.tokenUser);
    res.redirect("/user/welcome");
  }
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  global.userId = null;
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /user/welcome
module.exports.welcome = (req, res) => {
  res.render("patient/pages/home/index");
};

// [GET] /user/tai-khoan
module.exports.infoPatient = async (req, res) => {
  res.render("patient/pages/user/infoPatient");
};

// [GET] /user/metrics
module.exports.metrics = (req, res) => {
  res.render("patient/pages/user/metrics");
};

//[POST] /tai-khoan/edit
module.exports.edit = async (req, res) => {
  const id = res.locals.patient.id;
  const emailExist = await Patient.findOne({
    _id: { $ne: id }, //ne: not equal. Tìm những bản ghi khác id kia
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", "Email đã tồn tại");
  } else {
    req.flash("success", "Cập nhật thông tin thành công");
    await Patient.updateOne({ _id: id }, req.body);
  }
  res.redirect("back");
};

// [GET] /body-metrics/history
module.exports.bodyMetricsHistory = async (req, res) => {
  // console.log(res.locals.patient);
  const measurementList = res.locals.patient.measurement;
  let humanMetrics = [];
  for (let measurement of measurementList) {
    // let data = await SensorData.find({_id: ms.id});
    let measurementData = await Measurement.findById(measurement);
    let bodyTemp = await SensorData.findById(measurementData.sensors[2]);
    let heartBeat = await SensorData.findById(measurementData.sensors[3]);
    humanMetrics.push({
      timestamp: measurementData.timestamp,
      bodyTemp: bodyTemp.value,
      heartBeat: heartBeat.value,
    });
  }
  // console.log(humanMetrics);
  res.render("patient/pages/user/bodyMetricsHistory", {
    chiSoCoThe: humanMetrics,
  });
};

// [GET] /room-metrics/history
module.exports.roomMetricsHistory = async (req, res) => {
  // console.log(res.locals.patient);
  const measurementList = res.locals.patient.measurement;
  let roomMetrics = [];
  for (let measurement of measurementList) {
    // let data = await SensorData.find({_id: ms.id});
    let measurementData = await Measurement.findById(measurement);
    let roomTemp = await SensorData.findById(measurementData.sensors[0]);
    let moisture = await SensorData.findById(measurementData.sensors[1]);
    roomMetrics.push({
      timestamp: measurementData.timestamp,
      roomTemp: roomTemp.value,
      moisture: moisture.value,
    });
  }
  // console.log(humanMetrics);
  res.render("patient/pages/user/roomMetrics", {
    chiSoPhong: roomMetrics,
  });
};

module.exports.deleteMePatient = async (req, res) => {
  try {
    const id = res.locals.patient.id;
    console.log(id);
    const patient = await Patient.findOne({ _id: id });
    console.log(patient);
    patient.measurement = [];
    await patient.save();
    res.send("OK");
  } catch (error) {}
};

module.exports.deleteSensorData = async (req, res) => {
  try {
    await SensorData.deleteMany({});
    res.status(200).send("Delete successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error!");
  }
};

module.exports.deleteMeasurement = async (req, res) => {
  try {
    await Measurement.deleteMany({});
    res.status(200).send("Delete Successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error!");
  }
};
