const express = require('express');
const { zonegraph } = require('../../controllers');

const router = express.Router();
router.route('/school-student-teacher-graph-zonename').post(zonegraph.getAllSchoolStudentTeacherDataByZoneName);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Zonegraph
 *   description: School management
 */
/**
 * @swagger
 * /zonegraph/school-student-teacher-graph-zonename:
 *   post:
 *     summary: Get all schools, students, teachers graph  data by zoneName.
 *     description: Get graph data for schools, students, teachers by zoneName.
 *     tags: [Zonegraph]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *             example:
 *               zoneName: "Zone-01"
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
