const express = require('express');
const { studentController } = require('../../controllers');

const router = express.Router();

router.route('/webApi').get(studentController.getStudentData);

router.route('/').get(studentController.studentData);

router.route('/studentcount/schoolname').post(studentController.getStudentCountBySchoolName);

router.route('/studentcount/schoolname/gender').post(studentController.getStudentCountBySchoolNameAndGender);

router.route('/studentcount/schoolId/status').post(studentController.getStudentCountBySchoolNameAndStatus);

router.route('/student-attendance-data').post(studentController.getStudentAttendance);
router.route('/search-students').post(studentController.searchStudents);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: School management
 */

/**
 * @swagger
 * /student/search-students:
 *   post:
 *     summary: Get students data by Name , SCHOOL_NAME or S_ID property.
 *     description: Get students data by Name , SCHOOL_NAME or S_ID property.
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SCHOOL_NAME:
 *                 type: string
 *               Name:
 *                 type: string
 *               S_ID:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of matching students
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /student:
 *   get:
 *     summary: Get all schools
 *     description: Get a list of all schools.
 *     tags: [Student]
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
//  * /student:
//  *   get:
// *     summary: Get all role
// *     tags: [Student]
// *     security:
// *       - bearerAuth: []
// *     responses:
// *       "200":
// *         description: OK
// *         content:
// *           application/json:
// *             schema:
// *                $ref: '#/components/schemas/Language'
// *       "401":
// *         $ref: '#/components/responses/Unauthorized'
// *       "403":
// *         $ref: '#/components/responses/Forbidden'
// */

/**
// * @swagger
// * /student:
// *   get:
// *     summary: Get all Student
// *     tags: [Student]
// *     security:
// *       - bearerAuth: []
// // *     parameters:
// // *       - in: query
// // *         name: subject
// // *         schema:
// // *           type: string
// // *         description: Subject name *
// // *       - in: query
// // *         name: sortBy
// // *         schema:
// // *           type: string
// // *         description: sort by query in the form of field:desc/asc (ex. name:asc)
// // *       - in: query
// // *         name: limit
// // *         schema:
// // *           type: integer
// // *           minimum: 1
// // *         default: 10
// // *         description: Maximum number of subject
// // *       - in: query
// // *         name: page
// // *         schema:
// // *           type: integer
// // *           minimum: 1
// // *           default: 1
// // *         description: Page number
// *     responses:
// *       "200":
// *         description: OK
// *         content:
// *           application/json:
// *             schema:
// *               type: object
// *               properties:
// *                 results:
// *                   type: array
// *                   items:
// *                     $ref: '#/components/schemas/Book'
// *                 page:
// *                   type: integer
// *                   example: 1
// *                 limit:
// *                   type: integer
// *                   example: 10
// *                 totalPages:
// *                   type: integer
// *                   example: 1
// *                 totalResults:
// *                   type: integer
// *                   example: 1
// *       "401":
// *         $ref: '#/components/responses/Unauthorized'
// *       "403":
// *         $ref: '#/components/responses/Forbidden'
// */

/**
 * @swagger
 * /student/studentcount/schoolname:
 *   post:
 *     summary: Get all studentcount by school name.
 *     description: Get all studentcount by school name.
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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

/**
 * @swagger
 * /student/studentcount/schoolname/gender:
 *   post:
 *     summary: Get all studentcount by school name and Gender.
 *     description: Get all studentcount by school name and Gender.
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Schoolid:
 *                 type: string
 *               Gender:
 *                 type: string
 *             required:
 *               - Schoolid
 *               - Gender
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
 * /student/studentcount/schoolId/status:
 *   post:
 *     summary: Get all studentcount by school name and Gender.
 *     description: Get all studentcount by school name and Gender.
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Schoolid:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - Schoolid
 *               - status
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
//  * /student:
//  *   get:
// *     summary: Get all role
// *     tags: [Student]
// *     security:
// *       - bearerAuth: []
// *     responses:
// *       "200":
// *         description: OK
// *         content:
// *           application/json:
// *             schema:
// *                $ref: '#/components/schemas/Language'
// *       "401":
// *         $ref: '#/components/responses/Unauthorized'
// *       "403":
// *         $ref: '#/components/responses/Forbidden'
// */

// /**
// * @swagger
// * /student/student-attendance-data:
// *   get:
// *     summary: Get all Student
// *     tags: [Student]
// *     security:
// *       - bearerAuth: []
// *     parameters:
// *       - in: query
// *         name: Date
// *       - in: query
// *         name: Schoolid
// *     responses:
// *       "200":
// *         description: OK
// *       "401":
// *         description: Unauthorized
// *       "403":
// *         description: Forbidden
// */

/**
 * @swagger
 * /student/student-attendance-data:
 *   post:
 *     summary: Get school wise student attendance data.
 *     description: Get school wise student attendance data.
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Schoolid:
 *                 type: string
 *               Date:
 *                 type: string
 *             required:
 *               - Schoolid
 *               - Date
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
