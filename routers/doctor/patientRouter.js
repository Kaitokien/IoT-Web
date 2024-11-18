const express = require('express');
const router = express.Router();
const controller = require("../../controllers/doctor/patientList_controller")

router.get('/', controller.list);
router.get('/patient/:id/history', controller.history);

module.exports = router;