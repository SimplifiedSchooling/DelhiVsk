const express = require('express');
const { graphsController } = require('../../controllers');

const router = express.Router();

router.route('/').get(graphsController.getSchoolStats);

router.route('/school-teacher-student-graph').get(graphsController.getAllSchoolStudentTeacherData);
router.route('/school-graph').get(graphsController.getAggregatedSchoolDataController);
router.route('/school-graph-district').post(graphsController.getAggregatedSchoolDataByDistrictNameController);
router
  .route('/school-student-teacher-graph-districtname')
  .post(graphsController.getAllSchoolStudentTeacherDataByDistrictName);
router.route('/school-student-count-by-district').get(graphsController.getSchoolStudentCountByDistrictsController);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Graphs
 *   description: School management
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
 * /graphs/school:
 *   post:
 *      summary: Get School Statistics
 *      description: Retrieve statistics for schools based on query parameters.
 *      tags: [Graphs]
 *      parameters:
 *        - in: body
 *          name: requestBody
 *          description: Request body with query parameters.
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              SchCategory:
 *                type: string
 *                description: School Category
 *              shift:
 *                type: string
 *                description: School Shift
 *              School_Name:
 *                type: string
 *                description: School Name
 *      responses:
 *        200:
 *          description: Successful response
 *          schema:
 *            type: object
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /graphs/school-student-teacher-graph-districtname:
 *   post:
 *     summary: Get all schools, students, teachers graph data.
 *     description: Get graph data for schools, students, teachers.
 *     tags: [Graphs]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtName:
 *                 type: string
 *             example:
 *               districtName: "East"
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
