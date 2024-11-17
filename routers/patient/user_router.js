const express = require('express');
const router = express.Router();
const controller = require("../../controllers/patient/user_controller.js")
const validate = require("../../validates/patient/user_validate.js")
const authMiddleware = require('../../middlewares/patient/auth_middleware.js');

router.get('/register', controller.register);

router.post(
  '/register', 
  validate.registerPost,
  controller.registerPost
);

router.get(
  '/login', controller.login
);

router.post(
  '/login', 
  validate.loginPost,
  controller.loginPost
);

router.get('/logout', controller.logout);

router.get(
  '/welcome', 
  authMiddleware.requireAuth,
  controller.welcome
);

router.get('/tai-khoan', controller.infoPatient);
router.get('/metrics', controller.metrics);
router.post('/tai-khoan/edit', controller.edit);

router.get('/body-metrics/history', controller.bodyMetricsHistory);
router.get('/room-metrics/history', controller.roomMetricsHistory);
module.exports = router;