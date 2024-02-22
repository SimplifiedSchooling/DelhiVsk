const express = require('express');
const { tabularAttendaceController } = require('../../controllers');

const router = express.Router();

router.route('/').post(tabularAttendaceController.getAttendanceData);
router.route('/get-district').get(tabularAttendaceController.getAllDistrictsAndZones);

router.route('/get-studnet-health').get(tabularAttendaceController.getStudentHealth);

router.route('/live-school-attendance').post(tabularAttendaceController.getSchoolList);
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
 *               district_name:
 *                 type: string
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
 *   get:
 *     summary: Get students
 *     tags: [Tabular-Attendnace]
 *     parameters:
 *       - in: query
 *         name: Schoolid
 *         schema:
 *           type: string
 *         description: Schoolid
 *       - in: query
 *         name: Name
 *         schema:
 *           type: string
 *       - in: query
 *         name: S_ID
 *         schema:
 *           type: string
 *         description: S_ID name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. order:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of classes
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClassInput'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /tabular-attendnace/live-school-attendance:
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
 *               zone:
 *                 type: number
 *               date:
 *                 type: string
 *             required:
 *               - date
 *               - zone
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
