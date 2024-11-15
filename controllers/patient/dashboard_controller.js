//[GET] Trang giao diện trước khi đăng nhập, đăng ký
module.exports.index = (req, res) => {
  res.render('patient/pages/dashboard/index');
}
