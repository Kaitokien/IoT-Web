const express = require('express');
const router = express.Router();
const controller = require("../../controllers/patient/manageAccount_controller");

router.get('/', controller.index);

module.exports = router;