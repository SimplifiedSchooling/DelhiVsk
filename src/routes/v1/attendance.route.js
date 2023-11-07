const express = require('express');
const { attendanceController } = require('../../controllers');

const router = express.Router();

router.route('/').get(attendanceController.getAttedanceData);

router.route('/date-wise').post(attendanceController.getAttendanceCounts);

router.route('/district-wise/date-wise').post(attendanceController.getDistrictwiseAttendanceCount);

router.route('/zone/date-wise').post(attendanceController.getZoneAttendanceCount);

router.route('/zone/shift/wise').post(attendanceController.getZoneAttendanceCount);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management
 */

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all Attendance
 *     description: Get a list of all Attendance.
 *     tags: [Attendance]
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
