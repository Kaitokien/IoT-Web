const Patient = require("../../models/patient_model");
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
    res.redirect("/home");
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
    global.userId = patient.id;
    res.cookie("tokenUser", patient.tokenUser);
    res.redirect("/user/welcome");
  }
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  global.userId = "";
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
