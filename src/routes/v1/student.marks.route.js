const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { studentMarksValidation } = require('../../validations');
const { studentMarksController } = require('../../controllers');

const router = express.Router();

router
  .route('/:studentId')
  .get(validate(studentMarksValidation.getStudentMarks), studentMarksController.getStudentMarks);

  module.exports = router;

/**
 * @swagger
 * tags:
 *   name: StudentMarks
 *   description: Student management
 */



  /**
 * @swagger
 * /student-marks/{studentId}:
 *   get:
 *     summary: Get a Student Marks
 *     tags: [StudentMarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */