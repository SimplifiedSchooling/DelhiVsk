const express = require('express');
const { studentController } = require('../../controllers');

const router = express.Router();

router.route('/webApi').get(studentController.getStudentData);

router.route('/').get(studentController.studentData);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: School management
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
