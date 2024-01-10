const express = require('express');
const { tabularAttendaceController } = require('../../controllers');

const router = express.Router();

router.route('/').post(tabularAttendaceController.getAttendanceData);
router.route('/get-district').get(tabularAttendaceController.getAllDistrictsAndZones);

router.route('/get-studnet-health').get(tabularAttendaceController.getStudentHealth);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Tabular-Attendnace
 *   description: School management
 */

/**
 * @swagger
 * /tabular-attendnace:
 *   post:
 *     summary: Get tabular attendance.
 *     description: Get tabular attendance.
 *     tags: [Tabular-Attendnace]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Z_name:
 *                 type: string
 *               School_ID:
 *                 type: string
 *               shift:
 *                 type: string
 *               attendance_DATE:
 *                 type: string
 *             required:
 *               - attendance_DATE
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
 * /tabular-attendnace/get-district:
 *   get:
 *     summary: Get all district and zone.
 *     description: Get all district and zone.
 *     tags: [Tabular-Attendnace]
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
 * /tabular-attendnace/get-studnet-health:
 *   post:
 *     summary: Get tabular attendance.
 *     description: Get tabular attendance.
 *     tags: [Tabular-Attendnace]
 *     query:
 *             properties:
 *               Schoolid:
 *                 type: string
 *             required:
 *               - Schoolid
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
