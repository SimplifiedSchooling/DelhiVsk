const express = require('express');
const validate = require('../../middlewares/validate');
const { zonegraph } = require('../../controllers');
const zonegraphValidation = require('../../validations/zonegraph.validation');

const router = express.Router();

router
  .route('/school-student-teacher-graph-zonename')
  .post(
    validate(zonegraphValidation.getAllStudentSchoolTeacherDataByZoneName),
    zonegraph.getAllSchoolStudentTeacherDataByZoneName
  );

router.route('/school-student-teacher-graph-district').post(zonegraph.getAllSchoolStudentTeacherDataByDistrict);
router.route('/school-student-teacher-graph-schoolid').post(zonegraph.getAllSchoolStudentTeacherDataBySchoolName);

router.route('/stats-by-school-managment').post(zonegraph.getBySchManagement);
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

/**
 * @swagger
 * /zonegraph/school-student-teacher-graph-district:
 *   post:
 *     summary: Get all schools, students, teachers graph  data by district.
 *     description: Get graph data for schools, students, teachers by district.
 *     tags: [Zonegraph]
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
 * /zonegraph/school-student-teacher-graph-schoolid:
 *   post:
 *     summary: Get all schools, students, teachers graph  data by schoolId.
 *     description: Get graph data for schools, students, teachers by schoolId.
 *     tags: [Zonegraph]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *             example:
 *               schoolId: "1001001"
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
