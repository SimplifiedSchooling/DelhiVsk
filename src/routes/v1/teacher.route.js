const express = require('express');
const { teacherController } = require('../../controllers');

const router = express.Router();

router.route('/webApi').get(teacherController.getTeacherData);

router.route('/').get(teacherController.getTeacher);
router.route('/get-teachers-by-gender').post(teacherController.getTeacherBySchoolAndGender);

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

/**
 * @swagger
 * /teacher/get-teachers-by-gender:
 *   post:
 *     summary: Get all teacher list by school name and teacher gender.
 *     description: Get all teacher list by school name and teacher gender.
 *     tags: [Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *               schname:
 *                 type: string
 *             required:
 *               - gender
 *               - schname
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */