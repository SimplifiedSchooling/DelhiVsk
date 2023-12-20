const express = require('express');
const { graphsController } = require('../../controllers');

const router = express.Router();

router.route('/student-enrollment').get(graphsController.getStudentsEnrollmentGraph);
router.route('/').get(graphsController.getSchoolStats);

router.route('/school-teacher-student-graph').get(graphsController.getAllSchoolStudentTeacherData);
router.route('/school-graph').get(graphsController.getAggregatedSchoolDataController);
router.route('/school-graph-district').post(graphsController.getAggregatedSchoolDataByDistrictNameController);
router
  .route('/school-student-teacher-graph-districtname')
  .post(graphsController.getAllSchoolStudentTeacherDataByDistrictName);
router.route('/school-student-count-by-district').get(graphsController.getSchoolStudentCountByDistrictsController);

router.route('/school-student-count/zone').post(graphsController.getSchoolStudentCountByZone);
router.route('/dashboard/district-wise').post(graphsController.getSchoolStudentCountByDistrict);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Graphs
 *   description: School management
 */

/**
 * @swagger
 * /graphs/student-enrollment:
 *   get:
 *     summary: Get all schCategory wise  student count
 *     description: Get a school data students data.
 *     tags: [Graphs]
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
 * /graphs:
 *   get:
 *     summary: Get all schools overview
 *     description: Get a school data.
 *     tags: [Graphs]
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
 * /graphs/school-graph:
 *   get:
 *     summary: Get all school graph data
 *     description: Get school graph data.
 *     tags: [Graphs]
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
 * /graphs/school-teacher-student-graph:
 *   get:
 *     summary: Get all school, teacher, student graph data
 *     description: Get all school, teacher, student graph data
 *     tags: [Graphs]
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
 * /graphs/school-graph-district:
 *   post:
 *     summary: Get all schools graph data by district name.
 *     description: Get school graph data by district name.
 *     tags: [Graphs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DistrictName:
 *                 type: string
 *             required:
 *               - DistrictName
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
 * /graphs/school-student-count-by-district:
 *   get:
 *     summary: Get total school and student count for each district.
 *     description: Get total school and student count for each district.
 *     tags: [Graphs]
 *     responses:
 *       "200":
 *         description: OK
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /graphs/school-student-count/zone:
 *   post:
 *     summary: Get all schools graph data by district name.
 *     description: Get school graph data by district name.
 *     tags: [Graphs]
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
 * /graphs/dashboard/district-wise:
 *   post:
 *     summary: Get all schools total data by district name.
 *     description: Get school total data by district name.
 *     tags: [Graphs]
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
