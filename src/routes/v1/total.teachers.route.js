const express = require('express');
const { totalTeachersController } = require('../../controllers');

const router = express.Router();

router.route('/').get(totalTeachersController.getTeacherStats);
router.route('/district-wise').post(totalTeachersController.getTeacherStatsByDistrict);
router.route('/zone-wise').post(totalTeachersController.getTeacherStatsByZone);
router.route('/school-wise').post(totalTeachersController.getTeacherStatsBySchool);
// router.route('/search-teachers').post(teacherController.searchTeachers);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Total Teacher
 *   description: School management
 */

/**
 * @swagger
 * /total-teacher/district-wise:
 *   post:
 *     summary: Get teachers data by a single property (Name, schname, postdesc, or empid).
 *     description: Get teachers data by a single property (Name, schname, postdesc, or empid).
 *     tags: [Total Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of matching teachers
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /total-teacher/zone-wise:
 *   post:
 *     summary: Get teachers data by a single property (
 *     description: Get teachers data by a single property
 *     tags: [Total Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of matching teachers
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /total-teacher/school-wise:
 *   post:
 *     summary: Get teachers data by a single property (
 *     description: Get teachers data by a single property
 *     tags: [Total Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of matching teachers
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /total-teacher:
 *   get:
 *     summary: Get all Teacher
 *     description: Get a list of all schools.
 *     tags: [Total Teacher]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

// /**
//  * @swagger
//  * /teacher/get-teachers-by-gender:
//  *   post:
//  *     summary: Get all teacher list by school name and teacher gender.
//  *     description: Get all teacher list by school name and teacher gender.
//  *     tags: [Teacher]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               gender:
//  *                 type: string
//  *               schname:
//  *                 type: string
//  *             required:
//  *               - gender
//  *               - schname
//  *     responses:
//  *       "200":
//  *         description: OK
//  *       "401":
//  *         description: Unauthorized
//  *       "403":
//  *         description: Forbidden
//  */
