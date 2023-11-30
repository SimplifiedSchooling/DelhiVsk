const express = require('express');
const { attendanceController } = require('../../controllers');

const router = express.Router();

router.route('/').post(attendanceController.getAttedanceData);

router.route('/date-wise').post(attendanceController.getAttendanceCounts);

router.route('/district-wise/date-wise').post(attendanceController.getDistrictwiseAttendanceCount);

router.route('/zone/date-wise').post(attendanceController.getZoneAttendanceCount);

router.route('/zone/shift/wise').post(attendanceController.getAttendanceCountsShiftWise);

router.route('/district/present-student/per').post(attendanceController.getDistrictWisePresentCount);
//----------------------------------------------------------------
router.post('/genderandrangewise/count', attendanceController.getGenderRangeWiseCountCount);
router.post('/attendancepercentage/range/parameter', attendanceController.getAttendancePercentageByGenderAndRangeWise);
router.get('/top-performing-districts', attendanceController.getTopPerformingDistrictsController);
router.post('/top-performing-zones/bydistrictname', attendanceController.getTopPerformingZonesByDistrict);
router.post('/top-performing-schools/byzonename', attendanceController.getTopPerformingSchoolsByZoneName);
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
 *     summary: Get top 5 performing zones based on present counts for a specific district
 *     description:  Get top 5 performing zones based on present counts for a specific district
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtName:
 *                 type: string
 *             example:
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
 * /attendance/top-performing-schools/byzonename:
 *   post:
 *     summary: Get top 5 performing schools based on present counts for a specific zone
 *     description:  Get top 5 performing schools based on present counts for a specific zone
 *     tags: [Attendance]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *             example:
 *               zoneName: 'Zone-01'
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
 *               date: '25/11/2023'
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
 *   get:
 *     summary: Get top 5 performing districts based on present counts
 *     tags: [Attendance]
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
 *               startDate: '24/11/2023'
 *               endDate: '28/11/2023'
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
 *               startDate: '24/11/2023'
 *               endDate: '28/11/2023'
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
 *               date: '04/11/2023'
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
 *               date: '04/11/2023'
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
 *               date: '04/11/2023'
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
 *               date: '04/11/2023'
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
 *               date: '04/11/2023'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
