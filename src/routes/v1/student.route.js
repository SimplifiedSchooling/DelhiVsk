const express = require('express');
const { studentController } = require('../../controllers');

const router = express.Router();

router.route('/').get(studentController.getStudentData);

module.exports = router;

// /**
//  * @swagger
//  * tags:
//  *   name: Student
//  *   description: School management
//  */

// /**
//  * @swagger
//  * /student:
//  *   get:
//  *     summary: Get all schools
//  *     description: Get a list of all schools.
//  *     tags: [Student]
//  *     responses:
//  *       "200":
//  *         description: OK
//  *       "401":
//  *         description: Unauthorized
//  *       "403":
//  *         description: Forbidden
//  */
