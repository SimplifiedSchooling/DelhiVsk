const express = require('express');
const validate = require('../../middlewares/validate');
const { studentGraphAllController } = require('../../controllers');
const studentgraphValidation = require('../../validations/student.graph.validation');

const router = express.Router();
router
  .route('/student-graph-count-schoolName')
  .post(validate(studentgraphValidation.getAllStudentBySchoolName), studentGraphAllController.getStudentStatsBySchoolName);
router
  .route('/student-graph-count-districtname')
  .post(validate(studentgraphValidation.getAllStudentByDistrictName), studentGraphAllController.getStudentStatsByDistrictName);
router
  .route('/student-graph-count-zonename')
  .post(validate(studentgraphValidation.getAllStudentByZoneName), studentGraphAllController.getStudentStatsByZoneName);

router.route('/student-graph-count').get(studentGraphAllController.getStudentStats);

// router.route('/school-category-wise/district').post(teacherGraphController.getTeacherStatsByDistrict);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: AllStudentGraph
 *   description: Get student Graph data
 */

/**
 * @swagger
 * /all-student-graph/student-graph-count:
 *   get:
 *     summary: get student Graph data
 *     description: Get student Graph data
 *     tags: [AllStudentGraph]
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
 * /all-student-graph/student-graph-count-districtname:
 *   post:
 *     summary: Get all schools graph data by district name.
 *     description: Get school graph data by district name.
 *     tags: [AllStudentGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtName:
 *                 type: string
 *             required:
 *               - districtName
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
 * /all-student-graph/student-graph-count-schoolName:
 *   post:
 *     summary: Get all student graph data by school name.
 *     description: Get student graph data by school name.
 *     tags: [AllStudentGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolName:
 *                 type: string
 *             required:
 *               - schoolName
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
 * /all-student-graph/student-graph-count-zonename:
 *   post:
 *     summary: Get all schools graph data by zonename name.
 *     description: Get school graph data by zonename name.
 *     tags: [AllStudentGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *             required:
 *               - zoneName
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */