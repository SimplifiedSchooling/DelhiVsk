const express = require('express');
const { teacherAttendanceController } = require('../../controllers');

const router = express.Router();

// router.route('/webApi').get(teacherController.getTeacherData);

router.route('/').get(teacherAttendanceController.getAttendanceData);

module.exports = router;