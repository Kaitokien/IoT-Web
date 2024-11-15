// [GET] /
module.exports.index = async (req, res) => {
  res.render("patient/pages/home/index", {
    titlePage: "Xin chào bệnh nhân 1234"
  });
}