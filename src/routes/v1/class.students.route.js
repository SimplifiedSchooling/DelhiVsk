const express = require('express');
const { classStudentController } = require('../../controllers');

const router = express.Router();

router.route('/').get(classStudentController.getClasswiseCounts);
router.route('/district').post(classStudentController.getClasswiseCountsDistrict);

router.route('/zone').post(classStudentController.getClasswiseCountsZone);

router.route('/school').post(classStudentController.getClasswiseCountsSchool);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Class-Students
 *   description: School management
 */


/**
 * @swagger
 * /class-student:
 *   get:
 *     summary: Get all class student.
 *     description: Get all class student.
 *     tags: [Class-Students]
 *     responses:
 *       "200":
 *         description: OK
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /class-student/district:
 *   post:
 *     summary: Get class student district.
 *     description: Get class student district.
 *     tags: [Class-Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               district:
 *                 type: string
 *             required:
 *               - district
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
 * /class-student/zone:
 *   post:
 *     summary: Get class student zone.
 *     description: Get class student zone.
 *     tags: [Class-Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone:
 *                 type: string
 *             required:
 *               - zone
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
 * /class-student/school:
 *   post:
 *     summary: Get class school zone.
 *     description: Get class school zone.
 *     tags: [Class-Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Schoolid:
 *                 type: number
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
