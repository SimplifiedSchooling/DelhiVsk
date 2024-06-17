const express = require('express');
const { teacherAttendanceController } = require('../../controllers');

const router = express.Router();

// router.route('/webApi').get(teacherController.getTeacherData);

router.route('/').get(teacherAttendanceController.getAttendanceData);
router.route('/get-by-district').post(teacherAttendanceController.getAttendanceDataByDistrict);
router.route('/get-by-zone').get(teacherAttendanceController.getAttendanceDataByZone);
router.route('/get-by-schoolid').get(teacherAttendanceController.getAttendanceDataByschoolID);

router.route('/tendgraph').get(teacherAttendanceController.treandGraph);

router.route('/dashboard-attendance').get(teacherAttendanceController.getAttendanceDashbord);

module.exports = router;