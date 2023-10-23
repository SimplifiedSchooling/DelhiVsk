const express = require('express');
const { teacherController } = require('../../controllers');

const router = express.Router();

router.route('/webApi').get(teacherController.getTeacherData);

router.route('/').get(teacherController.getTeacher);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: School management
 */

/**
 * @swagger
 * /teacher:
 *   get:
 *     summary: Get all Teacher
 *     description: Get a list of all schools.
 *     tags: [Teacher]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
