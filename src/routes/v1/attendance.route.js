const express = require('express');
const validate = require('../../middlewares/validate');
const { attendanceController } = require('../../controllers');
const { attendanceValidation } = require('../../validations');

const router = express.Router();

router.route('/').post(attendanceController.getAttedanceData);

router.route('/date-wise').post(attendanceController.getAttendanceCounts);

router.route('/district-wise/date-wise').post(attendanceController.getDistrictwiseAttendanceCount);

router.route('/zone/date-wise').post(attendanceController.getZoneAttendanceCount);
router.route('/school/date-wise').post(attendanceController.getAttendanceCountsSchoolWise);

router.route('/zone/shift/wise').post(attendanceController.getAttendanceCountsShiftWise);
router.route('/attendance-status-wise').post(attendanceController.attendanceStatus);
router.route('/attendance-status-district-wise').post(attendanceController.attendanceStatusDistrictWise);
router.route('/attendance-status-zone-wise').post(attendanceController.attendanceStatusZoneWise);
router.route('/attendance-status-school-wise').post(attendanceController.attendanceStatusSchoolWise);
router.route('/attendance-status-shift-wise').post(attendanceController.attendanceStatusShiftWise);

router.route('/district/present-student/per').post(attendanceController.getDistrictWisePresentCount);
//----------------------------------------------------------------
router.post(
  '/genderandrangewise/count',
  validate(attendanceValidation.getGenderRangeWiseCount),
  attendanceController.getGenderRangeWiseCountCount
);
router.post(
  '/attendancepercentage/range/parameter',
  validate(attendanceValidation.getAttendancePercentageGenderAndRangeWise),
  attendanceController.getAttendancePercentageByGenderAndRangeWise
);
router.post(
  '/attendancepercentage/range/parameter/shift',
  validate(attendanceValidation.getAttendancePercentageGenderAndRangeAndShiftWise),
  attendanceController.getAttendancePercentageByGenderAndRangeAndShiftWise
);
router.post(
  '/top-performing-districts',
  validate(attendanceValidation.getTopPerformingDistricts),
  attendanceController.getTopPerformingDistrictsController
);
router.post(
  '/top-performing-zones/bydistrictname',
  validate(attendanceValidation.getTopPerformingZonesByDistrict),
  attendanceController.getTopPerformingZonesByDistrict
);
router.post(
  '/bottom-performing-zones/bydistrictname',
  validate(attendanceValidation.getBottomPerformingZonesByDistrict),
  attendanceController.getBottomPerformingZonesByDistrict
);
router.post(
  '/top-performing-schools/byzonename',
  validate(attendanceValidation.getTopPerformingSchoolsByZoneName),
  attendanceController.getTopPerformingSchoolsByZoneName
);
router.post(
  '/bottom-performing-schools/byzonename',
  validate(attendanceValidation.getBottomPerformingSchoolsByZoneName),
  attendanceController.getBottomPerformingSchoolsByZoneName
);
router.post(
  '/top-performing-classes/byschoolid',
  validate(attendanceValidation.getTopPerformingClassesBySchoolId),
  attendanceController.getTopPerformingClassesBySchoolId
);
router.post(
  '/bottom-performing-classes/byschoolid',
  validate(attendanceValidation.getBottomPerformingClassesBySchoolId),
  attendanceController.getBottomPerformingClassesBySchoolId
);
router.post(
  '/bottom-performing-districts',
  validate(attendanceValidation.getBottomPerformingDistricts),
  attendanceController.getBottomPerformingDistricts
);

router.post(
  '/schools-data-not-found-count',
  validate(attendanceValidation.getTopPerformingDistricts),
  attendanceController.getSchoolsDataNotFoundCount
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management
 */

/**
 * @swagger
 * /attendance/top-performing-zones/bydistrictname:
 *   post:
 *     summary: Get top 5 performing zones based on present counts for a specific district and date
 *     description:  Get top 5 performing zones based on present counts for a specific district and date
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtName:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               districtName: 'East'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/schools-data-not-found-count:
 *   post:
 *     summary: Get counts of schools of attendance data not found
 *     description:  Get counts of schools of attendance data not found
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *             example:
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/bottom-performing-zones/bydistrictname:
 *   post:
 *     summary: Get bottom 5 performing zones based on present counts for a specific district and date
 *     description:  Get bottom 5 performing zones based on present counts for a specific district and date
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtName:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               districtName: 'East'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/top-performing-schools/byzonename:
 *   post:
 *     summary: Get top 5 performing schools based on present counts for a specific zone and date
 *     description:  Get top 5 performing schools based on present counts for a specific zone and date
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               zoneName: 'Zone-01'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/bottom-performing-schools/byzonename:
 *   post:
 *     summary: Get bottom 5 performing schools based on present counts for a specific zone and date
 *     description:  Get bottom 5 performing schools based on present counts for a specific zone and date
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               zoneName: 'Zone-01'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Store Date wise  Attendance count graph  data .
 *     description:  Store Date wise  Attendance count graph  data
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *             example:
 *               date: '01-12-2023'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/top-performing-districts:
 *   post:
 *     summary: Get top 5 performing districts based on present counts by date
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *             example:
 *               date: '2023-12-01'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               - district_name: "District 1"
 *                 totalPresentCount: 500
 *               - district_name: "District 2"
 *                 totalPresentCount: 450
 *               - district_name: "District 3"
 *                 totalPresentCount: 400
 *               - district_name: "District 4"
 *                 totalPresentCount: 350
 *               - district_name: "District 5"
 *                 totalPresentCount: 300
 */

/**
 * @swagger
 * /attendance/bottom-performing-districts:
 *   post:
 *     summary: Get bottom 5 performing districts based on present counts by date
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *             example:
 *               date: '2023-12-01'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               - district_name: "District 1"
 *                 totalPresentCount: 500
 *               - district_name: "District 2"
 *                 totalPresentCount: 450
 *               - district_name: "District 3"
 *                 totalPresentCount: 400
 *               - district_name: "District 4"
 *                 totalPresentCount: 350
 *               - district_name: "District 5"
 *                 totalPresentCount: 300
 */

/**
 * @swagger
 * /attendance/genderandrangewise/count:
 *   post:
 *     summary: Get attendance gender and range wise count graph data .
 *     description:  Get attendance gender and range wise count graph data .
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *             example:
 *               schoolId: "1001004"
 *               startDate: '2023-12-01'
 *               endDate: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/attendancepercentage/range/parameter:
 *   post:
 *     summary: Get attendance by zoneName or districtName or schoolId  and range wise count graph data .
 *     description:  Get attendance gender and range wise count graph data .
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               zoneName:
 *                 type: string
 *               districtName:
 *                 type: string
 *             example:
 *               schoolId: "1001004"
 *               startDate: '2023-12-01'
 *               endDate: '2023-12-01'
 *               zoneName: 'Zone-01'
 *               districtName: 'East'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/attendancepercentage/range/parameter/shift:
 *   post:
 *     summary: Get attendance by zoneName or districtName or schoolId  and range wise count graph data .
 *     description:  Get attendance gender and range wise count graph data .
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               zoneName:
 *                 type: string
 *               districtName:
 *                 type: string
 *               shift:
 *                 type: string
 *             example:
 *               schoolId: "1001004"
 *               startDate: '2023-12-01'
 *               endDate: '2023-12-04'
 *               zoneName: 'Zone-01'
 *               districtName: 'East'
 *               shift: 'Evening'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/date-wise:
 *   post:
 *     summary: Get all  Attendance graph  data .
 *     description: Get all  Attendance graph  data.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *             example:
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/district-wise/date-wise:
 *   post:
 *     summary: Get all  Attendance graph  data by districtName.
 *     description: Get all  Attendance graph  data by districtName.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               districtName:
 *                 type: string
 *             example:
 *               date: '2023-12-01'
 *               districtName: "East"
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/zone/date-wise:
 *   post:
 *     summary: Get all  Attendance graph  data by zoneName.
 *     description: Get all  Attendance graph  data by zoneName.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               zoneName:
 *                 type: string
 *             example:
 *               date: '2023-12-01'
 *               zoneName: "Zone-01"
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/school/date-wise:
 *   post:
 *     summary: Get all  Attendance graph  data by schoolId.
 *     description: Get all  Attendance graph  data by schoolId.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               School_ID:
 *                 type: string
 *             example:
 *               date: '2023-12-01'
 *               School_ID: "Zone-01"
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/zone/shift/wise:
 *   post:
 *     summary: Get all  Attendance graph  data by shift wise.
 *     description: Get all  Attendance graph  data by shift .
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shift:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               shift: 'morning'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/attendance-status-wise:
 *   post:
 *     summary: Get all  Attendance School data by attendanceStatus.
 *     description: Get all  Attendance School  data by attendanceStatus.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendanceStatus:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               attendanceStatus: 'done'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/attendance-status-district-wise:
 *   post:
 *     summary: Get all  Attendance School data by attendanceStatus.
 *     description: Get all  Attendance School  data by attendanceStatus.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               district_name:
 *                 type: string
 *               attendanceStatus:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               district_name: "East"
 *               attendanceStatus: 'done'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/attendance-status-zone-wise:
 *   post:
 *     summary: Get all  Attendance School data by attendanceStatus.
 *     description: Get all  Attendance School  data by attendanceStatus.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Z_name:
 *                 type: string
 *               attendanceStatus:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               Z_name: "Zone-01"
 *               attendanceStatus: 'done'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/attendance-status-school-wise:
 *   post:
 *     summary: Get all  Attendance School data by attendanceStatus.
 *     description: Get all  Attendance School  data by attendanceStatus.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               School_ID:
 *                 type: string
 *               attendanceStatus:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               School_ID: "1001145"
 *               attendanceStatus: 'done'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/attendance-status-shift-wise:
 *   post:
 *     summary: Get all  Attendance School data by attendanceStatus.
 *     description: Get all  Attendance School  data by attendanceStatus.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shift:
 *                 type: string
 *               attendanceStatus:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               shift: "Morning"
 *               attendanceStatus: 'done'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/district/present-student/per:
 *   post:
 *     summary: Get all  Attendance persentage by district wise.
 *     description: Get all  Attendance persentage by district wise.
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *             example:
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/top-performing-classes/byschoolid:
 *   post:
 *     summary: Get top 5 performing classes based on present counts for a specific school and date
 *     description:  Get top 5 performing classes based on present counts for a specific school and date
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               schoolId: '1003001'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /attendance/bottom-performing-classes/byschoolid:
 *   post:
 *     summary: Get bottom 5 performing classes based on present counts for a specific school and date
 *     description:  Get bottom 5 performing classes based on present counts for a specific school and date
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               schoolId: '1003001'
 *               date: '2023-12-01'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
