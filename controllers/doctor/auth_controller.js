const Doctor = require('../../models/doctor_model');
const systemConfig = require('../../config/system');
// [GET] /doctor/auth/login
module.exports.login = (req, res) => {
  if(req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("doctor/pages/auth/login", {
      titlePage: "Trang đăng nhập"
    });
  }
}

// [POST] /doctor/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const doctor = await Doctor.findOne({
    email: email
  })

  if(!doctor) {
    req.flash('error', 'Email không tồn tại');
    res.redirect('back');
    return;
  }
  if(password != doctor.password) {
    req.flash('error', 'Sai mật khẩu');
    res.redirect('back');
    return;
  }
  res.cookie("token", doctor.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /doctor/auth/logout
module.exports.logout = (req, res) => {
  // Xóa token trong cookie
  res.clearCookie('token');
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}
