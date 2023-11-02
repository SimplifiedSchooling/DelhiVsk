const express = require('express');
const validate = require('../../middlewares/validate');
const { studentGraphController } = require('../../controllers');
const studentgraphValidation = require('../../validations/student.graph.validation');

const router = express.Router();

router
  .route('/student-graph-count-districtname')
  .post(validate(studentgraphValidation.getAllStudentByDistrictName), studentGraphController.getStudentStatsByDistrictName);
router
  .route('/student-graph-count-zonename')
  .post(validate(studentgraphValidation.getAllStudentByZoneName), studentGraphController.getStudentStatsByZoneName);

router.route('/student-graph-count').get(studentGraphController.getStudentStats);

// router.route('/school-category-wise/district').post(teacherGraphController.getTeacherStatsByDistrict);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: StudentGraph
 *   description: Get student Graph data
 */

/**
 * @swagger
 * /studentgraph/student-graph-count:
 *   get:
 *     summary: get student Graph data
 *     description: Get student Graph data
 *     tags: [StudentGraph]
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
 * /studentgraph/student-graph-count-districtname:
 *   post:
 *     summary: Get all schools graph data by district name.
 *     description: Get school graph data by district name.
 *     tags: [StudentGraph]
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
 * /studentgraph/student-graph-count-zonename:
 *   post:
 *     summary: Get all schools graph data by zonename name.
 *     description: Get school graph data by zonename name.
 *     tags: [StudentGraph]
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
